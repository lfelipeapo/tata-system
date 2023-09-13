import React, { useCallback, useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import UploadIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";

const UploadButton = ({ nomeCliente, clienteId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [consultaId, setConsultaId] = useState(null);

  const verifyConsultaId = useCallback(async (nomeCliente) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/consultas?nome_cliente=${encodeURIComponent(
          nomeCliente
        )}`
      );
      const data = await response.json();

      if (data && data.consultas && data.consultas.length > 0) {
        return data.consultas[0].id;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Erro ao buscar consultaId:", error);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles) => {
      if (acceptedFiles.length === 0) {
        return false;
      }

      if (!consultaId || consultaId === undefined) {
        let id = await verifyConsultaId(nomeCliente);
        if (!id) {
          setConsultaId(null);
        }
        setConsultaId(id);
      }

      Swal.fire({
        title: "Onde você deseja salvar o arquivo?",
        showDenyButton: true,
        confirmButtonText: "Nuvem",
        denyButtonText: "Local",
      }).then((result) => {
        const file = acceptedFiles[0];
        const formData = new FormData();
        formData.append("documento", file);
        if (result.isConfirmed) {
          formData.append("local_ou_samba", "samba");
        } else if (result.isDenied) {
          formData.append("local_ou_samba", "local");
        }
        formData.append("nome_cliente", nomeCliente);

        console.log("FormData:", [...formData.entries()]);
        setIsLoading(true);
        fetch("http://localhost:5000/documento/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response.json();
          })
          .then((data) => {
            return fetch("http://localhost:5000/documento", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                documento_nome: file.name,
                documento_localizacao: data.detalhes?.documento_localizacao,
                documento_url: data.detalhes?.documento_url,
                cliente_id: clienteId,
                consulta_id: consultaId
              }),
            });
          })
          .then((response) => {
            if (!response.ok) {
              throw response;
            }
            return response.json();
          })
          .then((data) => {
            Swal.fire("Sucesso!", "Documento salvo com sucesso!", "success");
          })
          .catch((errorResponse) => {
            errorResponse.json().then((error) => {
              Swal.fire(
                "Erro!",
                error.mensagem || "Ocorreu um erro ao enviar o arquivo.",
                "error"
              );
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      });
      return true;
    },
    [nomeCliente, consultaId]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button variant="outline" color="secondary" disabled={isLoading}>
        {isDragActive ? (
          <>
            <DriveFolderUploadIcon />
            Soltar Doc
          </>
        ) : (
          <>
            <UploadIcon />
            Upload Doc
          </>
        )}
      </Button>
      {isLoading && <CircularProgress />}
    </div>
  );
};

export default UploadButton;
