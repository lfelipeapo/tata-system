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
import PreviewIcon from "@mui/icons-material/Preview";
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";
import { CleaningServices } from "@mui/icons-material";
import styles from "./styles.module.css";

const Documentos = () => {
const [clientes, setClientes] = useState([]);
  const [documentos, setDocumentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const initialDocumento = {
    documento: null,
    documento_nome: "",
    cliente_id: "",
    consulta_id: "",
    documento_localizacao: "",
    documento_url: "",
    local_ou_samba: "",
  };
  const [newDocumento, setNewDocumento] = useState(initialDocumento);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/clientes")
        .then(response => response.json())
        .then(data => setClientes(data.clientes))
        .catch(error => console.error("Erro ao buscar clientes:", error));
  }, []);
    
  const getClienteNomeById = (id) => {
    const cliente = clientes?.find(cliente => cliente.id === id);
    return cliente ? cliente.nome_cliente : id;
  };

  const handleSearch = () => {
    const filteredDocumentos = documentos.filter((documento) =>
      Object.values(documento).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setDocumentos(filteredDocumentos);
  };

  const fetchDocumentos = () => {
    fetch("http://localhost:5000/documentos")
      .then((response) => {
        if (response.status === 404) {
          setDocumentos([]);
          return;
        } else if (response.status !== 200) {
          setDocumentos([]);
          return response.json().then((data) => {
            Swal.fire("Erro", data.mensagem || data[0]?.msg, "error");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.documentos) {
          setDocumentos(data.documentos);
          setLoading(false);
        }
      })
      .catch((error) => {
        setDocumentos([]);
        Swal.fire("Erro", error.message, "error");
      });
  };

  useEffect(() => {
    fetchDocumentos();
  }, []);

  const handleEdit = (id, field, value) => {
    setEdits((state) => ({
      ...state,
      [id]: { ...state[id], [field]: value },
    }));

    setDocumentos((documentos) =>
      documentos.map((documento) =>
        documento.id === id ? { ...documento, [field]: value } : documento
      )
    );
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
        setNewDocumento(initialDocumento);
        Swal.close();
      }
    });
  };
  
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("documento", newDocumento.documento);
    formData.append("local_ou_samba", newDocumento.local_ou_samba);
    formData.append("nome_cliente", getClienteNomeById(newDocumento.cliente_id));

    const uploadResponse = await fetch("http://localhost:5000/documento/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (uploadResponse.status !== 200) {
      Swal.fire("Erro", uploadData.mensagem || "Erro ao fazer upload do documento.", "error");
      return;
    }

    const { nome_arquivo, documento_url, documento_localizacao } = uploadData.detalhes;

    let consultaId = null;
    try {
      const response = await fetch(`http://localhost:5000/consultas?nome_cliente=${getClienteNomeById(newDocumento.cliente_id)}`);
      const data = await response.json();
      consultaId = data.consulta_id;
    } catch (error) {
      if (error.response?.status !== 404) {
        Swal.fire("Erro", "Erro ao buscar consulta_id", "error");
        return;
      }
    }

    const documentoToSend = {
      documento_nome: nome_arquivo,
      cliente_id: newDocumento.cliente_id,
      consulta_id: consultaId,
    };

    if (newDocumento.local_ou_samba === "samba") {
      documentoToSend.documento_url = documento_url;
    } else {
      documentoToSend.documento_localizacao = documento_localizacao;
    }

    if (!documentoToSend.consulta_id) {
      delete documentoToSend.consulta_id;
    }

    const response = await fetch(`http://localhost:5000/documento`, {
      method: "POST",
      body: JSON.stringify(documentoToSend),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": "pt-BR",
      },
    });

    const responseData = await response.json();

    if (response.status === 200) {
      Swal.fire("Sucesso", "Documento atualizado com sucesso!", "success");
    } else {
      Swal.fire("Erro", responseData.mensagem || "Erro desconhecido", "error");
    }
    setOpen(false);
    setNewDocumento(initialDocumento);
    fetchDocumentos();
  }

  const handleInputChange = (e) => {
    let { name, value, files } = e.target;
    setNewDocumento({
      ...newDocumento,
      [name]: name === 'documento'? files[0] : value,
    });
  };
    
    const handleUpdate = async (id) => {
      const documentoToUpdate = {
        ...documentos.find(doc => doc.id === id), 
        ...edits[id],
        id: id
        };
      const response = await fetch(`http://localhost:5000/documento`, {
        method: "PUT",
        body: JSON.stringify(documentoToUpdate),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept-Language": "pt-BR",
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        Swal.fire("Sucesso", "Documento atualizado com sucesso!", "success");
        setEditingRow(null);
        fetchDocumentos();
      } else {
        Swal.fire("Erro", data.mensagem || "Erro desconhecido", "error");
      }
    };

    const handleDelete = async (id) => {
      const response = await fetch('http://localhost:5000/documento?documento_id=' + id, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept-Language": "pt-BR",
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        Swal.fire("Sucesso", "Documento excluído com sucesso!", "success");
        fetchDocumentos();
      } else {
        Swal.fire("Erro", data.mensagem || "Erro desconhecido", "error");
      }
    };

  return (
    <Dashboard>
      <div style={{ minHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Gerenciamento de Documentos
          </Typography>
          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <FormControl
                variant="outlined"
                sx={{ mt: 1, mb: 2, minWidth: 120 }}
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
                onClick={fetchDocumentos}
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
              >
                Adicionar Documento
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nome do Documento</TableCell>
                  <TableCell>Nome do Cliente</TableCell>
                  <TableCell>Consulta ID</TableCell>
                  <TableCell>Localização</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {documentos.map((documento) => (
                  <TableRow key={documento.id}>
                    <TableCell>
                      {editingRow === documento.id ? (
                        <TextField
                          value={
                            edits[documento.id]?.documento_nome ||
                            documento.documento_nome
                          }
                          onChange={(e) =>
                            handleEdit(
                              documento.id,
                              "documento_nome",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        documento.documento_nome
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === documento.id ? (
                        <TextField
                          value={
                            edits[documento.id]?.cliente_id ||
                            documento.cliente_id
                          }
                          onChange={(e) =>
                            handleEdit(
                              documento.id,
                              "cliente_id",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        getClienteNomeById(documento.cliente_id)
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === documento.id ? (
                        <TextField
                          value={
                            edits[documento.id]?.consulta_id ||
                            documento.consulta_id
                          }
                          onChange={(e) =>
                            handleEdit(
                              documento.id,
                              "consulta_id",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        documento.consulta_id
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === documento.id ? (
                        <TextField
                          value={
                            edits[documento.id]?.documento_localizacao ||
                            documento.documento_localizacao
                          }
                          onChange={(e) =>
                            handleEdit(
                              documento.id,
                              "documento_localizacao",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        documento.documento_localizacao
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === documento.id ? (
                        <TextField
                          value={
                            edits[documento.id]?.documento_url ||
                            documento.documento_url
                          }
                          onChange={(e) =>
                            handleEdit(
                              documento.id,
                              "documento_url",
                              e.target.value
                            )
                          }
                        />
                      ) : (
                        <a
                          href={documento.documento_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PreviewIcon />
                        </a>
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === documento.id ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleUpdate(documento.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              setEditingRow(null);
                              fetchDocumentos();
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => setEditingRow(documento.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(documento.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Container>
      </div>
      <Dialog open={open} onClose={handleClose} className={styles.addDocumento}>
        <DialogTitle>Adicionar Documento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Preencha os campos abaixo para adicionar um novo documento.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="documento_nome"
            label="Nome do Documento"
            type="text"
            fullWidth
            variant="outlined"
            name="documento_nome"
            value={newDocumento.documento_nome}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="documento"
            label="Documento"
            type="file"
            fullWidth
            variant="outlined"
            name="documento"
            onChange={handleInputChange}
          />
          {/* <TextField
            margin="dense"
            id="cliente_id"
            label="Cliente ID"
            type="text"
            fullWidth
            variant="outlined"
            name="cliente_id"
            value={newDocumento.cliente_id}
            onChange={handleInputChange}
          /> */}
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="cliente-label">Cliente</InputLabel>
            <Select
              labelId="cliente-label"
              id="cliente_id"
              name="cliente_id"
              value={newDocumento.cliente_id}
              onChange={handleInputChange}
              label="Cliente"
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome_cliente}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" fullWidth>
            <InputLabel id="local-ou-samba-label">
              Localização do Documento
            </InputLabel>
            <Select
              labelId="local-ou-samba-label"
              id="local_ou_samba"
              name="local_ou_samba"
              value={newDocumento.local_ou_samba || ""}
              onChange={handleInputChange}
              label="Localização do Documento"
            >
              <MenuItem value="samba">Nuvem</MenuItem>
              <MenuItem value="local">Local</MenuItem>
            </Select>
          </FormControl>
          {/* <TextField
            margin="dense"
            id="documento_localizacao"
            label="Localização"
            type="text"
            fullWidth
            variant="outlined"
            name="documento_localizacao"
            value={newDocumento.documento_localizacao}
            onChange={handleInputChange}
          />
          <TextField
            margin="dense"
            id="documento_url"
            label="URL"
            type="text"
            fullWidth
            variant="outlined"
            name="documento_url"
            value={newDocumento.documento_url}
            onChange={handleInputChange}
          /> */}
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
    </Dashboard>
  );

};

export default Documentos;
