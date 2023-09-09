import React, { useState, useEffect } from "react";
import Dashboard from "../../components/layout/dashboard";
import {
  Box,
  CircularProgress,
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
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from '@mui/icons-material/EditNote';
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import SearchIcon from "@mui/icons-material/Search";
import TodayIcon from "@mui/icons-material/Today";
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";
import { CleaningServices } from "@mui/icons-material";
import styles from "./styles.module.css";

const Consultas = () => {
  const [consultas, setConsultas] = useState([]);
  const [loading, setLoading] = useState(false);
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
  const [dataConsulta, setDataConsulta] = useState("");
  const [horarioConsulta, setHorarioConsulta] = useState("");
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [detailEdit, setDetailEdit] = useState({ id: null, value: "" });
  const [detailViewDialogOpen, setDetailViewDialogOpen] = useState(false);
  const [detailView, setDetailView] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openDetailViewDialog = (value) => {
    setDetailView(value);
    setDetailViewDialogOpen(true);
  };

  const closeDetailViewDialog = () => {
    setDetailViewDialogOpen(false);
  };

  const openDetailEditDialog = (id, value) => {
    setDetailEdit({ id, value });
    setDetailDialogOpen(true);
  };

  const closeDetailEditDialog = () => {
    setDetailDialogOpen(false);
  };

  const handleDetailChange = (e) => {
    setDetailEdit((prev) => ({ ...prev, value: e.target.value }));
  };

  const saveDetailEdit = () => {
    handleEdit(detailEdit.id, "detalhes_consulta", detailEdit.value);
    closeDetailEditDialog();
  };

  const changeDateFormatWithBar = (value) => {
    console.log(value);
    const [year, month, day] = value.split("/");
    return `${day}-${month}-${year}`;
  };

  const fetchConsultas = () => {
    setLoading(true);
    fetch("http://localhost:5000/consultas")
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
      }).finally(() => {
        setLoading(false);
      });
  };

  const fetchConsultasHoje = () => {
    setLoading(true);
    fetch("http://localhost:5000/consultas/hoje")
      .then((response) => {
        if (response.status === 404) {
          return response.json().then((data) => {
            Swal.fire("Erro", data.mensagem, "error");
          });
        } else if (response.status !== 200) {
          return response.json().then((data) => {
            Swal.fire("Erro", data.mensagem || data[0]?.msg, "error");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.consultas) {
          setConsultas(data.consultas);
        }
      })
      .catch((error) => {
        Swal.fire("Erro", error.message, "error");
      }).finally(()=>{
        setLoading(false);
      });
  };

  const fetchConsultasPorHorario = async () => {
    setLoading(true);
    if (!dataConsulta || !horarioConsulta) {
      Swal.fire(
        "Erro",
        "Por favor, preencha a data e o horário da consulta.",
        "error"
      );
      return;
    }
    try {
      const [year, month, day] = dataConsulta.split("-");
      const formattedDate = `${day}/${month}/${year}`;
      const response = await fetch(
        `http://localhost:5000/consultas/horario?data_consulta=${encodeURIComponent(
          formattedDate
        )}&horario_consulta=${encodeURIComponent(horarioConsulta)}`,
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
    } finally {
      setLoading(false);
    }
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
    setLoading(true);
    const response = await fetch(`http://localhost:5000/consulta`, {
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
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
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
        `http://localhost:5000/consultas?${searchParam}=${encodeURIComponent(
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
    } finally {
      setLoading(false);
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
      <div style={{ minHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Consultas
          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <FormControl
                variant="outlined"
                sx={{ mt: 1, mb: 1, minWidth: 120 }}
              >
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
              <FormControl
                variant="outlined"
                sx={{ mt: 1, mb: 1, ml: 2, minWidth: 120 }}
              >
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
              <TextField
                margin="dense"
                name="data_consulta"
                label="Data da Consulta"
                type="date"
                value={dataConsulta}
                onChange={(e) => setDataConsulta(e.target.value)}
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ ml: 1, mr: 2 }}
              />
              <TextField
                margin="dense"
                name="horario_consulta"
                label="Horário da Consulta"
                type="time"
                value={horarioConsulta}
                onChange={(e) => setHorarioConsulta(e.target.value)}
                color="secondary"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ mr: 2 }}
              />
              <Button
                variant="contained"
                color="secondary"
                onClick={fetchConsultasPorHorario}
                sx={{ mt: 2, mb: 2 }}
              >
                Buscar por
                <AccessTimeFilledIcon sx={{ ml: 2 }} />
              </Button>
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
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<TodayIcon />}
                onClick={fetchConsultasHoje}
                sx={{ mt: 2, mb: 2 }}
              >
                Consultas de Hoje
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
          {loading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
              <CircularProgress />
            </Box>
          ) : (
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
                    consultas.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
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
                            <React.Fragment>
                              <IconButton onClick={() => openDetailEditDialog(row.id, row.detalhes_consulta)}>
                                <EditNoteIcon />
                              </IconButton>
                              <Dialog open={detailDialogOpen} onClose={closeDetailEditDialog}>
                                <DialogTitle>Editar Detalhes</DialogTitle>
                                <DialogContent>
                                  <TextField
                                    autoFocus
                                    margin="dense"
                                    type="text"
                                    fullWidth
                                    value={detailEdit.value}
                                    onChange={handleDetailChange}
                                  />
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={closeDetailEditDialog} color="primary">
                                    Cancelar
                                  </Button>
                                  <Button onClick={saveDetailEdit} color="primary">
                                    Salvar
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </React.Fragment>
                          ) : (
                            <React.Fragment>
                              <Button onClick={() => openDetailViewDialog(row.detalhes_consulta)}>
                                <VisibilityIcon color="action" />
                              </Button>
                              <Dialog open={detailViewDialogOpen} onClose={closeDetailViewDialog}>
                                <DialogTitle>Detalhes</DialogTitle>
                                <DialogContent>
                                  <Typography>{detailView}</Typography>
                                </DialogContent>
                                <DialogActions>
                                  <Button onClick={closeDetailViewDialog} color="primary">
                                    Fechar
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </React.Fragment>
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
                                    `http://localhost:5000/consulta`,
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
                                            `${error.loc.join(".")} : ${error.msg
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
                                    `http://localhost:5000/consulta?consulta_id=${row.id}`,
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
                                            `${error.loc.join(".")} : ${error.msg
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
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={consultas.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          )}
        </Container>
      </div>
    </Dashboard>
  );
};

export default Consultas;
