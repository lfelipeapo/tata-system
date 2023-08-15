import React, { useCallback, useState } from "react";
import { Button, CircularProgress } from "@mui/material";
import UploadIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';
import { useDropzone } from "react-dropzone";
import Swal from "sweetalert2";

const UploadButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const onDrop = useCallback((acceptedFiles) => {
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
          Swal.fire(
            "Sucesso!",
            data.mensagem,
            "success"
          );
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
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "application/pdf",
  });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <Button variant="outline" color="secondary" disabled={isLoading}>
        {isDragActive
          ? <><DriveFolderUploadIcon />Soltar Doc</>
          : <><UploadIcon />Upload Doc</>}
      </Button>
      {isLoading && <CircularProgress />}
    </div>
  );
};

export default UploadButton;
