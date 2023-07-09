import { useState } from "react";
import { useRouter } from "next/router";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import { Typography, Container, Box, Grid } from "@mui/material";

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

    try {
      const response = await fetch(`http://192.168.15.119:5000/user/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
          name: name,
          image: image,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Swal.fire("Success", "Usuário criado com sucesso!", "success");
        router.push("/");
      } else {
        Swal.fire("Error", data.mensagem || "Erro ao criar usuário", "error");
      }
    } catch (error) {
      Swal.fire("Error", "Erro ao criar usuário: " + error.message, "error");
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
            <TextField
              label="Usuário"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              color="secondary"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
              color="secondary"
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
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              fullWidth
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Criar Usuário"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
