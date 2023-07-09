import React, { useState, useEffect } from "react";
import Dashboard from "../../components/layout/dashboard";
import {
  Container,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  InputAdornment,
  IconButton as MuiIconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";
import { CleaningServices } from "@mui/icons-material";
import styles from "./styles.module.css";

const Consultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [newConsulta, setNewConsulta] = useState({
    nome_cliente: "",
    cpf_cliente: "",
    data_consulta: "",
    horario_consulta: "",
    detalhes_consulta: "",
  });
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const changeDateFormatWithBar = (value) => {
    console.log(value);
    const [year, month, day] = value.split("/");
    return `${day}-${month}-${year}`;
  };

  const fetchConsultas = () => {
    fetch("http://192.168.15.119:5000/consultas")
      .then((response) => {
        if (response.status === 404) {
          setConsultas([]);
          return;
        } else if (response.status !== 200) {
          setConsultas([]);
          return response.json().then((data) => {
            Swal.fire("Erro", data.mensagem || data[0]?.msg, "error");
          });
        } else if (Array.isArray(response.data) && response.data[0]?.msg) {
          setConsultas([]);
          const errorMsgs = response.data
            .map((error) => `${error.loc.join(".")} : ${error.msg}`)
            .join("\n");
          Swal.fire("Erro", errorMsgs, "error");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.consultas) {
          setConsultas(data.consultas);
          setLoading(false);
        }
      })
      .catch((error) => {
        setConsultas([]);
        Swal.fire("Erro", error.message, "error");
      });
  };

  useEffect(() => {
    fetchConsultas();
  }, []);

  const handleEdit = (id, field, value) => {
    setEdits((state) => ({
      ...state,
      [id]: { ...state[id], [field]: value },
    }));
  };

  const handleAdd = () => {
    setOpen(true);
  };

  const handleClose = () => {
    Swal.fire({
      title: "Deseja cancelar a operação?",
      icon: "warning",
      customClass: {
        popup: "popup",
      },
      showCancelButton: true,
      confirmButtonText: "Sim",
      cancelButtonText: "Não",
    }).then((result) => {
      if (result.isConfirmed) {
        setOpen(false);
        setNewConsulta({
          nome_cliente: "",
          cpf_cliente: "",
          data_consulta: "",
          horario_consulta: "",
          detalhes_consulta: "",
        });
      }
    });
  };

  const handleSave = async () => {
    const response = await fetch(`http://192.168.15.119:5000/consulta`, {
      method: "POST",
      body: JSON.stringify(newConsulta),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": "pt-BR",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      if (data) {
        Swal.fire("Success", "Consulta cadastrada com sucesso!", "success");
        setOpen(false);
        fetchConsultas();
        setNewConsulta({
          nome_cliente: "",
          cpf_cliente: "",
          data_consulta: "",
          horario_consulta: "",
          detalhes_consulta: "",
        });
      } else if (Array.isArray(data) && data[0]?.msg) {
        const errorMsgs = data
          .map((error) => `${error.loc.join(".")} : ${error.msg}`)
          .join("\n");
        Swal.fire("Erro", errorMsgs, "error");
      }
    } else if (response.status !== 200) {
      Swal.fire("Erro", data.mensagem || data[0]?.msg, "error");
    } else {
      Swal.fire("Erro", data.mensagem || "Unknown error", "error");
    }
  };

  const handleSearch = async () => {
    if (!searchParam || !searchValue) {
      Swal.fire(
        "Erro",
        "Por favor, selecione um parâmetro de pesquisa e digite um valor.",
        "error"
      );
      return;
    }
    try {
      const response = await fetch(
        `http://192.168.15.119:5000/consultas?${searchParam}=${encodeURIComponent(
          searchValue
        )}`,
        {
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Language": "pt-BR",
          },
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        if (data) {
          setConsultas(data.consultas);
        } else if (Array.isArray(data) && data[0]?.msg) {
          const errorMsgs = data
            .map((error) => `${error.loc.join(".")} : ${error.msg}`)
            .join("\n");
          Swal.fire("Erro", errorMsgs, "error");
        }
      } else if (response.status !== 200) {
        Swal.fire("Erro", data.mensagem || data[0]?.msg, "error");
      } else {
        Swal.fire("Erro", data.mensagem || "Unknown error", "error");
      }
    } catch (error) {
      Swal.fire("Erro", error.message, "error");
    }
  };

  const handleInputChange = (e) => {
    let { name, value } = e.target;

    if (name === "data_consulta") {
      const [year, month, day] = value.split("-");
      value = `${day}/${month}/${year}`;
    }

    setNewConsulta({
      ...newConsulta,
      [name]: value,
    });
  };

  return (
    <Dashboard>
      <div style={{ maxHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Consultas
          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                <InputLabel color="secondary" id="search-param-label">
                  Filtros
                </InputLabel>
                <Select
                  color="secondary"
                  labelId="search-param-label"
                  id="search-param"
                  value={searchParam}
                  onChange={(e) => setSearchParam(e.target.value)}
                  label="Filtros"
                >
                  <MenuItem value={"nome_cliente"}>Nome do Cliente</MenuItem>
                  <MenuItem value={"cpf"}>CPF do Cliente</MenuItem>
                  <MenuItem value={"data_consulta"}>Data da Consulta</MenuItem>
                </Select>
              </FormControl>
              <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
                <OutlinedInput
                  color="secondary"
                  id="search-value"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        color="secondary"
                        edge="end"
                        onClick={handleSearch}
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  }
                  labelwidth={0}
                />
              </FormControl>
              <IconButton
                sx={{ m: 1.75 }}
                color="secondary"
                edge="end"
                onClick={fetchConsultas}
              >
                <CleaningServices />
              </IconButton>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<AddIcon />}
                onClick={handleAdd}
                sx={{ mt: 2, mb: 2 }}
              >
                Adicionar Consulta
              </Button>
            </Grid>
          </Grid>
          <Dialog
            className={styles.addConsulta}
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Adicionar Consulta</DialogTitle>
            <DialogContent>
              <DialogContentText>Preencha a nova consulta.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                name="nome_cliente"
                label="Nome do Cliente"
                type="text"
                fullWidth
                value={newConsulta.nome_cliente}
                onChange={handleInputChange}
                color="secondary"
              />
              <TextField
                margin="dense"
                name="cpf_cliente"
                label="CPF do Cliente"
                type="text"
                fullWidth
                value={newConsulta.cpf_cliente}
                onChange={handleInputChange}
                color="secondary"
              />
              <TextField
                margin="dense"
                name="data_consulta"
                label="Data da Consulta"
                type="date"
                fullWidth
                value={changeDateFormatWithBar(newConsulta.data_consulta)}
                onChange={handleInputChange}
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                name="horario_consulta"
                label="Horário da Consulta"
                type="time"
                fullWidth
                value={newConsulta.horario_consulta}
                onChange={handleInputChange}
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
              />
              <TextField
                margin="dense"
                name="detalhes_consulta"
                label="Detalhes da Consulta"
                type="text"
                multiline
                rows={4}
                fullWidth
                value={newConsulta.detalhes_consulta}
                onChange={handleInputChange}
                color="secondary"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose} color="primary">
                Cancelar
              </Button>
              <Button onClick={handleSave} color="primary">
                Salvar
              </Button>
            </DialogActions>
          </Dialog>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>CPF do Cliente</TableCell>
                  <TableCell>Nome do Cliente</TableCell>
                  <TableCell>Data</TableCell>
                  <TableCell>Horário</TableCell>
                  <TableCell>Detalhes</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {consultas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Não existem consultas cadastradas
                    </TableCell>
                  </TableRow>
                ) : (
                  consultas.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            value={
                              edits[row.id]?.cpf_cliente || row.cpf_cliente
                            }
                            onChange={(e) =>
                              handleEdit(row.id, "cpf_cliente", e.target.value)
                            }
                          />
                        ) : (
                          row.cpf_cliente
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            value={
                              edits[row.id]?.nome_cliente || row.nome_cliente
                            }
                            onChange={(e) =>
                              handleEdit(row.id, "nome_cliente", e.target.value)
                            }
                          />
                        ) : (
                          row.nome_cliente
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            value={
                              edits[row.id]?.data_consulta || row.data_consulta
                            }
                            onChange={(e) =>
                              handleEdit(
                                row.id,
                                "data_consulta",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          row.data_consulta
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            value={
                              edits[row.id]?.horario_consulta ||
                              row.horario_consulta
                            }
                            onChange={(e) =>
                              handleEdit(
                                row.id,
                                "horario_consulta",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          row.horario_consulta
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            value={
                              edits[row.id]?.detalhes_consulta ||
                              row.detalhes_consulta
                            }
                            onChange={(e) =>
                              handleEdit(
                                row.id,
                                "detalhes_consulta",
                                e.target.value
                              )
                            }
                          />
                        ) : (
                          row.detalhes_consulta
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <React.Fragment>
                            <IconButton
                              onClick={async () => {
                                let rowToUpdate = edits[row.id] || row;
                                if (
                                  rowToUpdate.data_consulta &&
                                  rowToUpdate.data_consulta.includes("/")
                                ) {
                                  rowToUpdate = {
                                    ...rowToUpdate,
                                    data_consulta: changeDateFormatWithBar(
                                      rowToUpdate.data_consulta
                                    ),
                                  };
                                }
                                const response = await fetch(
                                  `http://192.168.15.119:5000/consulta`,
                                  {
                                    method: "PUT",
                                    body: JSON.stringify({
                                      ...rowToUpdate,
                                      consulta_id: row.id,
                                    }),
                                    headers: {
                                      "Content-Type":
                                        "application/json; charset=utf-8",
                                      "Accept-Language": "pt-BR",
                                    },
                                  }
                                );
                                const data = await response.json();
                                if (response.status === 200) {
                                  if (data) {
                                    Swal.fire(
                                      "Success",
                                      "Consulta atualizada com sucesso!",
                                      "success"
                                    );
                                    setEditingRow(null);
                                    fetchConsultas();
                                  } else if (
                                    Array.isArray(data) &&
                                    data[0]?.msg
                                  ) {
                                    const errorMsgs = data
                                      .map(
                                        (error) =>
                                          `${error.loc.join(".")} : ${
                                            error.msg
                                          }`
                                      )
                                      .join("\n");
                                    Swal.fire("Erro", errorMsgs, "error");
                                  }
                                } else if (response.status !== 200) {
                                  Swal.fire(
                                    "Erro",
                                    data.mensagem || data[0]?.msg,
                                    "error"
                                  );
                                } else {
                                  Swal.fire(
                                    "Erro",
                                    data.mensagem || "Unknown error",
                                    "error"
                                  );
                                }
                              }}
                            >
                              <CheckIcon />
                            </IconButton>
                            <IconButton
                              onClick={() => {
                                setEditingRow(null);
                              }}
                            >
                              <CloseIcon />
                            </IconButton>
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <IconButton
                              onClick={() => {
                                setEditingRow(row.id);
                              }}
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              onClick={async () => {
                                const response = await fetch(
                                  `http://192.168.15.119:5000/consulta?consulta_id=${row.id}`,
                                  {
                                    method: "DELETE",
                                  }
                                );
                                const data = await response.json();
                                if (response.status === 200) {
                                  if (data.mensagem) {
                                    Swal.fire(
                                      "Success",
                                      data.mensagem,
                                      "success"
                                    );
                                    fetchConsultas();
                                  } else if (
                                    Array.isArray(data) &&
                                    data[0]?.msg
                                  ) {
                                    const errorMsgs = data
                                      .map(
                                        (error) =>
                                          `${error.loc.join(".")} : ${
                                            error.msg
                                          }`
                                      )
                                      .join("\n");
                                    Swal.fire("Erro", errorMsgs, "error");
                                  }
                                } else if (response.status !== 200) {
                                  Swal.fire(
                                    "Erro",
                                    data.mensagem || data[0]?.msg,
                                    "error"
                                  );
                                } else {
                                  Swal.fire(
                                    "Erro",
                                    data.mensagem || "Unknown error",
                                    "error"
                                  );
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </React.Fragment>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    </Dashboard>
  );
};

export default Consultas;
