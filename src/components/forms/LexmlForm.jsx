'use client'
import React, { useState } from "react";
import {
  Button,
  Autocomplete,
  TextField,
  FormControl,
  Grid,
} from "@mui/material";
import Swal from "sweetalert2";
import { getLeis } from "../../services/lexmlService";

function LexmlForm({ results, setResults, setLoading }) {
  const [keyword, setKeyword] = useState("");
  const [tipoDocumento, setTipoDocumento] = useState("");
  const [sort, setSort] = useState("");

  const tiposDocumentoOptions = [
    "Legislação",
    "Jurisprudência",
    "Proposições Legislativas",
    "Doutrina",
  ];

  const sortOptions = [
    { label: "Relevância", value: "" },
    { label: "Título", value: "title" },
    { label: "Data ascendente", value: "year" },
    { label: "Data descendente", value: "reverse-year" },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!keyword) {
      Swal.fire({
        icon: "warning",
        title: "Atenção!",
        text: "Preencha a palavra-chave.",
      });
      return;
    }

    setLoading(true);

    try {
      const response = await getLeis({
        keyword: keyword.split(" ").join("+"),
        tipoDocumento,
        sort,
      });
      if (response && response.data && response.data.documentos) {
        setResults(response.data.documentos);
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
      console.error("Erro ao buscar leis:", error);
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
      <form onSubmit={handleSubmit}>
        <Grid
          container
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <Grid item xs={12} sm={3}>
            <TextField
              color="secondary"
              variant="outlined"
              fullWidth
              name="keyword"
              label="Palavra-chave"
              id="keyword"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                id="tipoDocumento"
                options={tiposDocumentoOptions}
                value={tipoDocumento}
                onChange={(event, newValue) => {
                  setTipoDocumento(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    color="secondary"
                    {...params}
                    label="Tipo de Documento"
                    variant="outlined"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined">
              <Autocomplete
                id="sort"
                options={sortOptions}
                getOptionLabel={(option) => option.label}
                value={sortOptions.find((opt) => opt.value === sort)}
                onChange={(event, newValue) => {
                  setSort(newValue ? newValue.value : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Ordenação"
                    variant="outlined"
                    color="secondary"
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="secondary"
            >
              Buscar
            </Button>
          </Grid>
        </Grid>
      </form>
    );
}

export default LexmlForm;
