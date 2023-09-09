'use client'
import React, { useState, useEffect } from "react";
import {
  Button,
  Autocomplete,
  TextField,
  Container,
  CssBaseline,
  ThemeProvider,
  createTheme,
  FormControl,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import { getNormas, getTiposNorma } from "../../services/senadoService";

const theme = createTheme({
  palette: {
    primary: {
      main: "#f50057", // Cor secondary do MUI
    },
  },
});

function SenadoForm({ results, setResults, termos, setTermos, setLoading }) {
  const [tipo, setTipo] = useState("");
  const [ano, setAno] = useState("");
  const [numero, setNumero] = useState("");
  const [tiposNorma, setTiposNorma] = useState([]);

  useEffect(() => {
    const fetchTiposNorma = async () => {
      try {
        const response = await getTiposNorma();
        const uniqueTiposNorma = Array.from(
          new Set(
            response.data.ListaTiposDocumento.TiposDocumento.TipoDocumento.map(
              (tipo) => tipo.Codigo
            )
          )
        ).map((codigo) => {
          return response.data.ListaTiposDocumento.TiposDocumento.TipoDocumento.find(
            (tipo) => tipo.Codigo === codigo
          );
        });
        setTiposNorma(uniqueTiposNorma);
      } catch (error) {
        console.error("Erro ao buscar tipos de norma:", error);
      }
    };

    fetchTiposNorma();
  }, []);

  const handleClear = async () => {
    setLoading(true);
    setTermos("");

    try {
      const response = await getNormas({ tipo, ano, numero });
      if (
        response &&
        response.data &&
        response.data.ListaDocumento &&
        response.data.ListaDocumento.documentos &&
        response.data.ListaDocumento.documentos.documento
      ) {
        setResults(response.data.ListaDocumento.documentos.documento);
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Dados carregados com sucesso.",
        });
      } else {
        setResults([]);
        Swal.fire({
          icon: "info",
          title: "Informação!",
          text: "Não existem resultados para a pesquisa.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de norma:", error);
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Ocorreu um erro ao realizar a pesquisa.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    if (!ano && !numero) {
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Preencha o ano ou o número da lei.",
      });
      return;
    }

    if (termos) {
      const filteredResults = results.filter(
        (doc) =>
          doc.ementa.includes(termos) ||
          doc.descricao.includes(termos) ||
          doc.normaNome.includes(termos)
      );
      setResults(filteredResults);
      return;
    }

    try {
      const response = await getNormas({ tipo, ano, numero });
      if (
        response &&
        response.data &&
        response.data.ListaDocumento &&
        response.data.ListaDocumento.documentos &&
        response.data.ListaDocumento.documentos.documento
      ) {
        setResults(response.data.ListaDocumento.documentos.documento);
        Swal.fire({
          icon: "success",
          title: "Sucesso!",
          text: "Dados carregados com sucesso.",
        });
      } else {
        setResults([]);
        Swal.fire({
          icon: "info",
          title: "Informação!",
          text: "Não existem resultados para a pesquisa.",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar tipos de norma:", error);
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Ocorreu um erro ao realizar a pesquisa.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="lg" sx={{ mb: 8 }}>
        <CssBaseline />
        <div>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} alignItems="center" justifyContent="space-between">
              <Grid item xs={12} sm={4}>
                <FormControl fullWidth variant="outlined">
                  <Autocomplete
                    id="tipo"
                    options={tiposNorma}
                    getOptionLabel={(option) =>
                      option ? option.Descricao : ""
                    }
                    value={
                      tiposNorma.find((option) => option.Sigla === tipo) || null
                    }
                    onChange={(event, newValue) => {
                      setTipo(newValue ? newValue.Sigla : "");
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="Tipo" variant="outlined" />
                    )}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="ano"
                  label="Ano"
                  id="ano"
                  value={ano}
                  onChange={(e) => setAno(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField
                  variant="outlined"
                  fullWidth
                  name="numero"
                  label="Número"
                  id="numero"
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ maxWidth: "300px", width: "100%" }}
                >
                  Buscar
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  onClick={handleClear}
                  fullWidth
                  variant="outlined"
                  sx={{ maxWidth: "300px", width: "100%", marginTop: "10px" }}
                >
                  Limpar
                </Button>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </ThemeProvider>
  );
}

export default SenadoForm;