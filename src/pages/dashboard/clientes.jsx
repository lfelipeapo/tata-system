import React, { useState, useEffect, useCallback } from "react";
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
  TablePagination,
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
import styles from "./styles.module.css"
import DocumentUpload from "../../components/DocumentUpload";
import swalAlert from "../../components/alerts/Alert";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [newCliente, setNewCliente] = useState({
    nome_cliente: "",
    cpf_cliente: "",
  });
  const [searchParam, setSearchParam] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const fetchClientes = () => {
    setLoading(true);

    // Dados mockados para simular a resposta do servidor
    const mockClientes = [
      { id: 1, nome_cliente: "Cliente 1", cpf_cliente: "123.456.789-00", data_cadastro: "2023-01-01", data_atualizacao: "2023-01-02" },
      { id: 2, nome_cliente: "Cliente 2", cpf_cliente: "123.456.789-01", data_cadastro: "2023-01-02", data_atualizacao: "2023-01-03" },
      // Adicione mais clientes conforme necessário
    ];

    // Comente a requisição real para usar os dados mockados
    // fetch("http://localhost:5000/clientes")
    //   .then((response) => {
    //     // Código da requisição real
    //   })
    //   .catch((error) => {
    //     // Código da requisição real
    //   }).finally(()=>{
    //     setLoading(false);
    //   });

    // Usando os dados mockados no lugar da resposta real
    setClientes(mockClientes);
    setLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  useEffect(() => {
    fetchClientes();
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
        setNewCliente({
          nome_cliente: "",
          cpf_cliente: "",
        });
      }
    });
  };

  const handleSave = async () => {
    setLoading(true);
    const response = await fetch(`http://localhost:5000/cliente`, {
      method: "POST",
      body: JSON.stringify(newCliente),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": "pt-BR"
      },
    });
    const data = await response.json();
    if (data.mensagem || data[0]?.msg) {
      swalAlert("Error", data.mensagem || data[0]?.msg, "error");
      setLoading(false);
    } else {
      setOpen(false);
      setLoading(false);
      swalAlert("Success", "Cliente adicionado com sucesso!", "success");
      fetchClientes();
    }
  };

  const handleSearch = async () => {
    if (!searchParam || !searchValue) {
      swalAlert(
        "Error",
        "Por favor, selecione um parâmetro de pesquisa e digite um valor.",
        "error"
        );
        return;
      }
      
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/clientes?${searchParam}=${encodeURIComponent(
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
      if (data.mensagem) {
        swalAlert("Error", data.mensagem, "error");
      } else {
        if (data.clientes) {
          setClientes(data.clientes);
        } else {
          setClientes([]);
        }
        }
      } catch (error) {
        swalAlert("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
  };

  const handleInputChange = (e) => {
    setNewCliente({
      ...newCliente,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Dashboard>
      <div style={{ minHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Clientes
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
                  <MenuItem value={"nome"}>Nome</MenuItem>
                  <MenuItem value={"cpf"}>CPF</MenuItem>
                  <MenuItem value={"data_cadastro"}>
                    Data de Cadastro
                  </MenuItem>
                  <MenuItem value={"data_atualizacao"}>
                    Data de Atualização
                  </MenuItem>
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
                onClick={fetchClientes}
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
                Adicionar Cliente
              </Button>
            </Grid>
          </Grid>
          <Dialog
            className={styles.addCliente}
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Adicionar Cliente</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Preencha os detalhes do novo cliente.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                name="nome_cliente"
                label="Nome do Cliente"
                type="text"
                fullWidth
                value={newCliente.nome_cliente}
                onChange={handleInputChange}
                color="secondary"
              />
              <TextField
                margin="dense"
                name="cpf_cliente"
                label="CPF do Cliente"
                type="text"
                fullWidth
                value={newCliente.cpf_cliente}
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
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="50vh"
            >
              <CircularProgress />
            </Box>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>CPF</TableCell>
                    <TableCell>Nome</TableCell>
                    <TableCell>Cadastro</TableCell>
                    <TableCell>Atualização</TableCell>
                    <TableCell>Ação</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {clientes.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Não existem clientes cadastrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    clientes
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>{row.id}</TableCell>
                          <TableCell>
                            {editingRow === row.id ? (
                              <TextField
                                value={
                                  edits[row.id]?.cpf_cliente ||
                                  row.cpf_cliente
                                }
                                onChange={(e) =>
                                  handleEdit(
                                    row.id,
                                    "cpf_cliente",
                                    e.target.value
                                  )
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
                                  edits[row.id]?.nome_cliente ||
                                  row.nome_cliente
                                }
                                onChange={(e) =>
                                  handleEdit(
                                    row.id,
                                    "nome_cliente",
                                    e.target.value
                                  )
                                }
                              />
                            ) : (
                              row.nome_cliente
                            )}
                          </TableCell>
                          <TableCell>{row.data_cadastro}</TableCell>
                          <TableCell>{row.data_atualizacao}</TableCell>
                          <TableCell>
                            {editingRow === row.id ? (
                              <React.Fragment>
                                <IconButton
                                  onClick={async () => {
                                    const rowToUpdate = edits[row.id] || row;
                                    setLoading(true);
                                    const response = await fetch(
                                      `http://localhost:5000/cliente`,
                                      {
                                        method: "PUT",
                                        body: JSON.stringify({
                                          ...rowToUpdate,
                                          cliente_id: editingRow,
                                        }),
                                        headers: {
                                          "Content-Type":
                                            "application/json; charset=utf-8",
                                          "Accept-Language": "pt-BR",
                                        },
                                      }
                                    );
                                    const data = await response.json();
                                    if (data.mensagem || data[0]?.msg) {
                                      swalAlert(
                                        "Error",
                                        data.mensagem || data[0]?.msg,
                                        "error"
                                      );
                                      setLoading(false);
                                    } else {
                                      setEditingRow(null);
                                      swalAlert(
                                        "Success",
                                        "Registro atualizado com sucesso!",
                                        "success"
                                      );
                                      setLoading(false);
                                      fetchClientes();
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
                                    setLoading(true);
                                    const response = await fetch(
                                      `http://localhost:5000/cliente?cliente_id=${row.id}`,
                                      {
                                        method: "DELETE",
                                      }
                                    );
                                    const data = await response.json();
                                    if (data.mensagem) {
                                      swalAlert(
                                        "Error",
                                        data.mensagem,
                                        "error"
                                      );
                                      setLoading(false);
                                    } else {
                                      swalAlert(
                                        "Success",
                                        "Registro deletado com sucesso!",
                                        "success"
                                      );
                                      setLoading(false);
                                      fetchClientes();
                                    }
                                  }}
                                >
                                  <DeleteIcon />
                                </IconButton>
                                  <IconButton>
                                  <DocumentUpload
                                    nomeCliente={row.nome_cliente}
                                    clienteId={row.id}
                                  />
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
                count={clientes.length}
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

export default Clientes;