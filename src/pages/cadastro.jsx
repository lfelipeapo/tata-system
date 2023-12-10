import { useState } from "react";
import { useRouter } from "next/router";
import Button from "@mui/material/Button";
import { Typography, Container, Box, Grid } from "@mui/material";
import TextFieldComponent from "../components/inputs/TextFieldComponent";
import SubmitButtonComponent from "../components/buttons/SubmitButtonComponent";
import swalAlert from "../components/alerts/Alert";

export default function CreateUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    // Simulando uma resposta do servidor com um mock JSON
    const mockResponse = {
      ok: true,
      mensagem: "Usuário criado com sucesso!",
      user_id: "12345", // Exemplo de ID de usuário retornado
    };

    try {
      // Comente a requisição real para usar o mock
      // const response = await fetch(`http://localhost:5000/user/create`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: username,
      //     password: password,
      //     name: name,
      //     image: image,
      //   }),
      // });

      // const data = await response.json();

      // Usando o mockResponse no lugar da resposta real
      const response = { ok: mockResponse.ok };
      const data = mockResponse;

      if (response.ok) {
        swalAlert("Success", "Usuário criado com sucesso!", "success");
        router.push("/");
      } else {
        swalAlert("Error", data.mensagem || "Erro ao criar usuário", "error");
      }
    } catch (error) {
      swalAlert("Error", "Erro ao criar usuário: " + error.message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(URL.createObjectURL(e.target.files[0]));
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 7, mb: 3 }}>
        <Typography variant="h4" align="center">
          Criar Usuário
        </Typography>
      </Box>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextFieldComponent
              label="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFieldComponent
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <TextFieldComponent
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          <Grid item xs={12}>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="raised-button-file"
              type="file"
              onChange={handleImageChange}
            />
            <label htmlFor="raised-button-file">
              <Button variant="contained" color="secondary" component="span">
                Upload Imagem
              </Button>
            </label>
            {image && <img src={image} alt="preview" />}
          </Grid>
          <Grid item xs={12}>
            <SubmitButtonComponent isLoading={isLoading} text="Criar Usuário" />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
