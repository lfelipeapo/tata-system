import { useState } from "react";
import { useRouter } from "next/router";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import GavelIcon from "@mui/icons-material/Gavel";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Slide from "@mui/material/Slide";
import Avatar from "@mui/material/Avatar";
import Cookies from "js-cookie";
import TextFieldComponent from "../components/inputs/TextFieldComponent";
import SubmitButtonComponent from "../components/buttons/SubmitButtonComponent";
import LinkGridComponent from "../components/grids/LinkGridComponent";
import swalAlert from "../components/alerts/Alert";

const theme = createTheme();

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      swalAlert("Erro", "Usuário e senha são obrigatórios", "error");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Simulando uma resposta do servidor com um mock JSON
    const mockResponse = {
      ok: true,
      user_id: "12345", // Exemplo de ID de usuário retornado
      token: "fakeToken12345", // Exemplo de token retornado
    };

    try {
      // Comente a requisição real para usar o mock
      // const response = await fetch(`http://localhost:5000/user/authenticate`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: username,
      //     password: password,
      //   }),
      // });

      // const data = await response.json();

      // Usando o mockResponse no lugar da resposta real
      const response = { ok: mockResponse.ok };
      const data = mockResponse;

      if (response.ok) {
        Cookies.set("ui", data.user_id);
        Cookies.set("token", data.token);
        router.push("/dashboard");
      } else {
        //Não adicionei tratamentos de erro
      }
    } catch (error) {
      swalAlert("Erro", "Erro ao autenticar: " + error.message, "error");
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
            <TextFieldComponent
              label="Usuário"
              value={username}
              name="username"
              autoComplete="username"
              id="username"
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextFieldComponent
              label="Senha"
              type="password"
              name="password"
              value={password}
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="secondary" />}
              label="Lembre-se de mim"
            />
            <SubmitButtonComponent isLoading={isLoading} text="Acessar" />
            <LinkGridComponent links={[{ href: "#", text: "Perdeu a senha?" }, { href: "/cadastro", text: "Você não tem usuário. Crie um!" }]} />
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
