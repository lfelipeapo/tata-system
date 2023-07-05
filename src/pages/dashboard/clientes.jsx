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
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import Swal from "sweetalert2";

<style jsx global>{`
  .popup {
    z-index: 1000000 !important;
  }
`}</style>;

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

  const fetchClientes = () => {
    fetch("http://localhost:5000/clientes")
      .then((response) => response.json())
      .then((data) => {
        if (data.clientes) {
          setClientes(data.clientes);
          setLoading(false);
        }
      })
      .catch((error) => {
        Swal.fire("Error", error.message, "error");
      });
  };

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
        popup: 'popup'
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
    const response = await fetch(`http://localhost:5000/cliente`, {
      method: "POST",
      body: JSON.stringify(newCliente),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (data.mensagem || data[0]?.msg) {
      Swal.fire("Error", data.mensagem || data[0]?.msg, "error");
    } else {
      setOpen(false);
      Swal.fire("Success", "Cliente adicionado com sucesso!", "success");
      fetchClientes();
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
      <div style={{ maxHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Clientes
          </Typography>
          <Button
            variant="contained"
            color="secondary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
            sx={{ mb: 4 }}
          >
            Adicionar Cliente
          </Button>
          <Dialog open={open} onClose={handleClose}>
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
                {clientes.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>
                      {editingRow === row.id ? (
                        <TextField
                          value={edits[row.id]?.cpf_cliente || row.cpf_cliente}
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
                    <TableCell>{row.data_cadastro}</TableCell>
                    <TableCell>{row.data_atualizacao}</TableCell>
                    <TableCell>
                      {editingRow === row.id ? (
                        <React.Fragment>
                          <IconButton
                            onClick={async () => {
                              const rowToUpdate = edits[row.id] || row;
                              const response = await fetch(
                                `http://localhost:5000/cliente`,
                                {
                                  method: "PUT",
                                  body: JSON.stringify({
                                    ...rowToUpdate,
                                    cliente_id: editingRow,
                                  }),
                                  headers: {
                                    "Content-Type": "application/json",
                                  },
                                }
                              );
                              const data = await response.json();
                              if (data.mensagem || data[0]?.msg) {
                                Swal.fire(
                                  "Error",
                                  data.mensagem || data[0]?.msg,
                                  "error"
                                );
                              } else {
                                setEditingRow(null);
                                Swal.fire(
                                  "Success",
                                  "Registro atualizado com sucesso!",
                                  "success"
                                );
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
                              const response = await fetch(
                                `http://localhost:5000/cliente?cliente_id=${row.id}`,
                                {
                                  method: "DELETE",
                                }
                              );
                              const data = await response.json();
                              if (data.mensagem) {
                                Swal.fire("Error", data.mensagem, "error");
                              } else {
                                Swal.fire(
                                  "Success",
                                  "Registro deletado com sucesso!",
                                  "success"
                                );
                                fetchClientes();
                              }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </React.Fragment>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
    </Dashboard>
  );
};

export default Clientes;
