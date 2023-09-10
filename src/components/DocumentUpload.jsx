import React, { useCallback, useState, useEffect } from "react";
import { Button, CircularProgress } from "@mui/material";
import UploadIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";

const UploadButton = ({ nomeCliente, clienteId, consultaId }) => {
  const [isLoading, setIsLoading] = useState(false);
  const onDrop = useCallback(
    (acceptedFiles) => {
      if (consultaId === undefined) {
        Swal.fire(
          "Erro!",
          "Não foi possível encontrar o ID da consulta.",
          "error"
        );
        return;
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
