import { useState } from "react";
import { useRouter } from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import GavelIcon from "@mui/icons-material/Gavel";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const theme = createTheme();

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/user/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("token", data.token);
        router.push("/dashboard");
      } else {
        let errorMessage;
        if (response.status === 400) {
          errorMessage = "Falha na autenticação: " + data.mensagem;
        } else if (response.status === 401) {
          errorMessage = "Falha na autenticação: " + data.mensagem;
        } else if (response.status === 422) {
          errorMessage = "Falha na autenticação: ";
          if (data.mensagem) {
            errorMessage += data.mensagem;
          } else if (
            Array.isArray(data) &&
            data.some((el) => el.msg && el.loc)
          ) {
            data.forEach((error) => {
              errorMessage += `Campo ${error.loc.join(", ")}: ${error.msg}. `;
            });
          } else {
            errorMessage += "Erros de validação não especificados.";
          }
        }

        Swal.fire({
          icon: "error",
          title: "Erro",
          text: errorMessage,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Erro ao autenticar: " + error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Slide direction="down" in mountOnEnter unmountOnExit>
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <GavelIcon />
            </Avatar>
          </Slide>
          <Typography component="h1" variant="h5">
            Thata System
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              variant="outlined"
              margin="normal"
              color="secondary"
              required
              fullWidth
              id="username"
              label="Usuário"
              name="username"
              autoComplete="username"
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              color="secondary"
              required
              fullWidth
              name="password"
              label="Senha"
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="secondary" />}
              label="Lembre-se de mim"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
              sx={{ mt: 3, mb: 2 }}
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} /> : "Acessar"}
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Perdeu a senha?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Você não tem usuário. Crie um!"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
