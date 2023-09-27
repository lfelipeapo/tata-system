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

const PeçasProcessuais = () => {
  const [clientes, setClientes] = useState([]);
  const [pecas, setPecas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [localOuSamba, setLocalOuSamba] = useState("local");
  const initialPeca = {
    peca: null,
    nome_peca: "",
    categoria: "",
    documento_localizacao: "",
    documento_url: "",
    local_ou_samba: "",
  };
  const [newPeca, setNewPeca] = useState(initialPeca);
  const [searchValue, setSearchValue] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/clientes")
        .then(response => response.json())
        .then(data => setClientes(data.clientes))
        .catch(error => console.error("Erro ao buscar clientes:", error));
  }, []);

  const handleSearch = () => {
    const filteredPecas = pecas.filter((peca) =>
      Object.values(peca).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setPecas(filteredPecas);
  };

  const fetchPecas = () => {
    fetch("http://localhost:5000/pecas-processuais")
      .then((response) => {
        if (response.status === 404) {
          setPecas([]);
          return;
        } else if (response.status !== 200) {
          setPecas([]);
          return response.json().then((data) => {
            Swal.fire("Erro", data.mensagem || data[0]?.msg, "error");
          });
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.pecas_processuais) {
          setPecas(data.pecas_processuais);
          setLoading(false);
        }
      })
      .catch((error) => {
        setPecas([]);
        Swal.fire("Erro", error.message, "error");
      });
  };

  useEffect(() => {
    fetchPecas();
  }, []);

  const handleEdit = (id, field, value) => {
    setEdits((state) => ({
      ...state,
      [id]: { ...state[id], [field]: value },
    }));

    setPecas((pecas) =>
      pecas.map((peca) =>
        peca.id === id ? { ...peca, [field]: value } : peca
      )
    );

    if (field === "local_ou_samba") {
      setLocalOuSamba(value);
    }
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
        setNewPeca(initialPeca);
        Swal.close();
      }
    });
  };
  
  const handleSave = async () => {
    const formData = new FormData();
    formData.append("peca", newPeca.peca);
    formData.append("local_ou_samba", newPeca.local_ou_samba);
    formData.append("categoria", newPeca.categoria);

    const uploadResponse = await fetch("http://localhost:5000/peca/upload", {
      method: "POST",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (uploadResponse.status !== 200) {
      Swal.fire("Erro", uploadData.mensagem || "Erro ao fazer upload do peca.", "error");
      return;
    }

    const { nome_arquivo, documento_url, documento_localizacao } = uploadData.detalhes;

    const pecaToSend = {
        nome_peca: nome_arquivo,
        categoria: newPeca.categoria
    };

    newPeca.local_ou_samba === "samba" ? pecaToSend.documento_url = documento_url : pecaToSend.documento_localizacao = documento_localizacao;

    const response = await fetch(`http://localhost:5000/peca-processual`, {
      method: "POST",
      body: JSON.stringify(pecaToSend),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": "pt-BR",
      },
    });

    const responseData = await response.json();

    if (response.status === 200) {
      Swal.fire("Sucesso", "Peca atualizado com sucesso!", "success");
    } else {
      Swal.fire("Erro", responseData.mensagem || "Erro desconhecido", "error");
    }
    setOpen(false);
    setNewPeca(initialPeca);
    fetchPecas();
  }

  const handleInputChange = (e) => {
    let { name, value, files } = e.target;
    setNewPeca({
      ...newPeca,
      [name]: name === 'peca' ? files[0] : value,
    });
  };
    
  const handleUpdate = async (id) => {
    const pecaToUpdate = {
      ...pecas.find(peca => peca.id === id), 
      ...edits[id],
      id: id
    };
    
    const formData = new FormData();
    formData.append("peca", pecaToUpdate.peca);
    formData.append("local_ou_samba", localOuSamba);
    formData.append("local_ou_samba_antigo", pecaToUpdate.documento_localizacao ? 'local' : 'samba'); 
    formData.append("categoria", pecaToUpdate.categoria);
    formData.append("filename_antigo", pecaToUpdate.nome_peca);
    
    const uploadResponse = await fetch("http://localhost:5000/peca/armazenamento", {
      method: "PUT",
      body: formData,
    });

    const uploadData = await uploadResponse.json();

    if (uploadResponse.status !== 200) {
      Swal.fire("Erro", uploadData.mensagem || "Erro ao fazer upload do peca.", "error");
      return;
    }

    if(uploadResponse.status === 200 && uploadData) {
      let pecaNome = uploadData.detalhes.nome_arquivo;
      let pecaLocalizacao = uploadData.detalhes?.documento_localizacao;
      let pecaUrl = uploadData.detalhes?.documento_url;

      pecaToUpdate.nome_peca = pecaNome;
      pecaToUpdate.documento_localizacao = pecaToUpdate.local_ou_samba === 'local' ? pecaLocalizacao : null;
      pecaToUpdate.documento_url = pecaToUpdate.local_ou_samba === 'samba' ? pecaUrl : null;

      const response = await fetch(`http://localhost:5000/peca-processual`, {
        method: "PUT",
        body: JSON.stringify(pecaToUpdate),
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Accept-Language": "pt-BR",
        },
      });
      const data = await response.json();
      if (response.status === 200) {
        Swal.fire("Sucesso", data.mensagem || "Peça Processual atualizada com sucesso!", "success");
        setEditingRow(null);
        fetchPecas();
      } else {
        Swal.fire("Erro", data.mensagem || "Erro desconhecido", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    const pecaToDelete = pecas.find((peca) => peca.id === id);

    const result = await Swal.fire({
      title: "Você deseja deletar o peca do armazenamento também?",
      showDenyButton: true,
      confirmButtonText: `Sim`,
      denyButtonText: `Não`,
    });

    if (result.isConfirmed) {
      try {
        const response = await fetch(
          `http://localhost:5000/peca/armazenamento`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "Accept-Language": "pt-BR",
            },
            body: JSON.stringify({
              local_ou_samba: pecaToDelete.documento_localizacao ? 'local' : 'samba',
              categoria: pecaToDelete.categoria, 
              filename: pecaToDelete.nome_peca,
            }),
          }
        );

        const data = await response.json();

        if (response.status !== 200) {
          Swal.fire(
            "Erro",
            data.mensagem || "Erro ao deletar o peca do armazenamento.",
            "error"
          );
          return;
        }

        Swal.fire(
          "Sucesso",
          "Peça deletado do armazenamento com sucesso!",
          "success"
        );
      } catch (error) {
        Swal.fire(
          "Erro",
          "Erro ao deletar a peça do armazenamento.",
          "error"
        );
      }
    }

    try {
      const response = await fetch(
        `http://localhost:5000/peca-processual?peca_id=${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json; charset=utf-8",
            "Accept-Language": "pt-BR",
          },
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        Swal.fire("Sucesso", "Peca excluído com sucesso!", "success");
        fetchPecas();
      } else {
        Swal.fire("Erro", data.mensagem || "Erro desconhecido", "error");
      }
    } catch (error) {
      Swal.fire("Erro", "Erro ao deletar o registro do peca.", "error");
    }
  };

  return (
    <Dashboard>
      <div style={{ minHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Gerenciamento de Peças Processuais
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
                onClick={fetchPecas}
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
                Adicionar Peca
              </Button>
            </Grid>
          </Grid>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Nome da Peça</TableCell>
                  <TableCell>Localização</TableCell>
                  <TableCell>URL</TableCell>
                  <TableCell>Categoria</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {pecas.map((peca) => (
                  <TableRow key={peca.id}>
                    <TableCell>
                      {editingRow === peca.id ? (
                        <input
                          type="file"
                          onChange={(e) =>
                            handleEdit(peca.id, "peca", e.target.files[0])
                          }
                        />
                      ) : (
                        peca.nome_peca
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === peca.id ? (
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="local-ou-samba-label">
                            Localização
                          </InputLabel>
                          <Select
                            labelId="local-ou-samba-label"
                            id="local_ou_samba"
                            name="local_ou_samba"
                            value={localOuSamba || 'local'}
                            onChange={(e) =>
                              handleEdit(
                                peca.id,
                                "local_ou_samba",
                                e.target.value
                              )
                            }
                            label="Localização"
                          >
                            <MenuItem value="local">Local</MenuItem>
                            <MenuItem value="samba">Samba</MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        peca.documento_localizacao
                      )}
                    </TableCell>
                    <TableCell>
                      {
                        <a
                          href={peca.documento_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <PreviewIcon />
                        </a>
                      }
                    </TableCell>
                    <TableCell>
                      {editingRow === peca.id ? (
                        <FormControl variant="outlined" fullWidth>
                          <InputLabel id="categoria-label">
                            Categoria
                          </InputLabel>
                          <Select
                            labelId="categoria-label"
                            id="categoria"
                            name="categoria"
                            value={peca.categoria ?? "direito_civil"}
                            onChange={(e) =>
                              handleEdit(peca.id, "categoria", e.target.value)
                            }
                            label="Categoria"
                          >
                            <MenuItem value="direito_civil">
                              Direito Civil
                            </MenuItem>
                            <MenuItem value="direito_previdenciario">
                              Direito Previdenciário
                            </MenuItem>
                            <MenuItem value="direito_trabalhista">
                              Direito Trabalhista
                            </MenuItem>
                          </Select>
                        </FormControl>
                      ) : (
                        peca.categoria
                      )}
                    </TableCell>
                    <TableCell>
                      {editingRow === peca.id ? (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => handleUpdate(peca.id)}
                          >
                            <CheckIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => {
                              setEditingRow(null);
                              setLocalOuSamba("local");
                              fetchPecas();
                            }}
                          >
                            <CloseIcon />
                          </IconButton>
                        </>
                      ) : (
                        <>
                          <IconButton
                            color="primary"
                            onClick={() => setEditingRow(peca.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            color="secondary"
                            onClick={() => handleDelete(peca.id)}
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
      <Dialog open={open} onClose={handleClose} className={styles.addPeca}>
        <DialogTitle>Adicionar Peça</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Preencha os campos abaixo para adicionar uma nova peça.
          </DialogContentText>
          <TextField
            color="secondary"
            style={{ marginBottom: '8px' }}
            autoFocus
            margin="dense"
            id="nome_peca"
            label="Nome da Peça"
            type="text"
            fullWidth
            variant="outlined"
            name="nome_peca"
            value={newPeca.nome_peca}
            onChange={handleInputChange}
          />
          <DialogContentText>
            Peça Processual
          </DialogContentText>
          <TextField
            color="secondary"
            style={{ marginBottom: '16px' }}
            margin="dense"
            id="peca"
            type="file"
            fullWidth
            variant="outlined"
            name="peca"
            onChange={handleInputChange}
          />
          <FormControl color="secondary" style={{ marginBottom: '16px' }} variant="outlined" fullWidth>
            <InputLabel id="categoria-label">Categoria</InputLabel>
            <Select
              labelId="categoria-label"
              id="categoria"
              name="categoria"
              value={newPeca.categoria}
              onChange={handleInputChange}
              label="Categoria"
            >
              <MenuItem value="direito_civil">Direito Civil</MenuItem>
              <MenuItem value="direito_previdenciario">
                Direito Previdenciário
              </MenuItem>
              <MenuItem value="direito_trabalhista">
                Direito Trabalhista
              </MenuItem>
            </Select>
          </FormControl>
          <FormControl color="secondary" variant="outlined" fullWidth>
            <InputLabel id="local-ou-samba-label">
              Localização da Peça
            </InputLabel>
            <Select
              labelId="local-ou-samba-label"
              id="local_ou_samba"
              name="local_ou_samba"
              value={newPeca.local_ou_samba || ""}
              onChange={handleInputChange}
              label="Localização da Peça"
            >
              <MenuItem value="samba">Nuvem</MenuItem>
              <MenuItem value="local">Local</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Cancelar
          </Button>
          <Button onClick={handleSave} color="secondary">
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Dashboard>
  );

};

export default PeçasProcessuais;
