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
import PreviewIcon from '@mui/icons-material/Preview';
import SearchIcon from "@mui/icons-material/Search";
import Grid from "@mui/material/Grid";
import Swal from "sweetalert2";
import { CleaningServices } from "@mui/icons-material";
import styles from "./styles.module.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [editingRow, setEditingRow] = useState(null);
  const [open, setOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    name: "",
    image: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [editedImages, setEditedImages] = useState({});

  const handleSearch = () => {
    const filteredUsers = users.filter((user) =>
      Object.values(user).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchValue.toLowerCase())
      )
    );
    setUsers(filteredUsers);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewUser({ ...newUser, image: URL.createObjectURL(e.target.files[0]) });
    }
  };

  const handleImageUpload = async (id, e, isNewUser = false) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:5000/upload/image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.url) {
        console.log(data.url)
        if (isNewUser) {
          setNewUser({ ...newUser, image: data.url });
        } else {
          handleEdit(id, "image", data.url);
          setEditedImages((state) => ({
            ...state,
            [id]: data.url,
          }));
        }
      } else {
        console.error("Erro ao fazer upload da imagem. URL não recebida.");
      }
    }
  };

  const fetchUsers = () => {
    fetch("http://localhost:5000/users")
      .then((response) => {
        if (response.status === 404) {
          setUsers([]);
          return;
        } else if (response.status !== 200) {
          setUsers([]);
          return response.json().then((data) => {
            Swal.fire("Erro", data.mensagem || data[0]?.msg, "error");
          });
        } else if (Array.isArray(response.data) && response.data[0]?.msg) {
          setUsers([]);
          const errorMsgs = response.data
            .map((error) => `${error.loc.join(".")} : ${error.msg}`)
            .join("\n");
          Swal.fire("Erro", errorMsgs, "error");
        }
        return response.json();
      })
      .then((data) => {
        if (data && data.users) {
          setUsers(data.users);
          setLoading(false);
        }
      })
      .catch((error) => {
        setUsers([]);
        Swal.fire("Erro", error.message, "error");
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (id, field, value) => {
    setEdits((state) => ({
      ...state,
      [id]: { ...state[id], [field]: value },
    }));

    if (field === "image") {
      setEditedImages((state) => ({
        ...state,
        [id]: value,
      }));
    }

    setUsers((users) =>
      users.map((user) => (user.id === id ? { ...user, [field]: value } : user))
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
        setNewUser({
          username: "",
          password: "",
          name: "",
          image: "",
        });
      }
    });
  };

  const handleSave = async () => {
    const response = await fetch(`http://localhost:5000/user/create`, {
      method: "POST",
      body: JSON.stringify(newUser),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Accept-Language": "pt-BR",
      },
    });
    const data = await response.json();
    if (response.status === 201) {
      if (data) {
        Swal.fire("Success", "Usuário cadastrado com sucesso!", "success");
        setOpen(false);
        fetchUsers();
        setNewUser({
          username: "",
          password: "",
          name: "",
          image: "",
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

  const handleInputChange = (e) => {
    let { name, value } = e.target;
    setNewUser({
      ...newUser,
      [name]: value,
    });
  };

  return (
    <Dashboard>
      <div style={{ minHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Gerenciamento de Usuários
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
                onClick={fetchUsers}
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
                Adicionar Usuário
              </Button>
            </Grid>
          </Grid>
          <Dialog
            className={styles.addUsuario}
            open={open}
            onClose={handleClose}
          >
            <DialogTitle>Adicionar Novo Usuário</DialogTitle>
            <DialogContent>
              <DialogContentText>Preencha o novo usuário.</DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                name="username"
                label="Username do Usuário"
                type="text"
                fullWidth
                value={newUser.username}
                onChange={handleInputChange}
                color="secondary"
              />
              <TextField
                margin="dense"
                name="password"
                label="Senha"
                type="password"
                fullWidth
                value={newUser.password}
                onChange={handleInputChange}
                color="secondary"
              />
              <TextField
                margin="dense"
                name="name"
                label="Nome do Usuário"
                type="text"
                fullWidth
                value={newUser.name}
                onChange={handleInputChange}
                color="secondary"
              />
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="raised-button-file"
                type="file"
                onChange={(e) => handleImageUpload(null, e, true)}
              />
              <label htmlFor="raised-button-file">
                <Button variant="contained" color="secondary" component="span">
                  Upload Imagem
                </Button>
              </label>
              {newUser.image && <img src={newUser.image} alt="preview" />}
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
                  <TableCell>Username</TableCell>
                  <TableCell>Senha</TableCell>
                  <TableCell>Nome</TableCell>
                  <TableCell>Imagem</TableCell>
                  <TableCell>Ação</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Não existem usuários cadastradas
                    </TableCell>
                  </TableRow>
                ) : (
                  users.map((row) => (
                    <TableRow key={row.id}>
                      <TableCell>{row.id}</TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            value={edits[row.id]?.username || row.username}
                            onChange={(e) =>
                              handleEdit(row.id, "username", e.target.value)
                            }
                          />
                        ) : (
                          row.username
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            type="password"
                            value={edits[row.id]?.password || ""}
                            onChange={(e) =>
                              handleEdit(row.id, "password", e.target.value)
                            }
                          />
                        ) : (
                          "••••••••"
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <TextField
                            value={edits[row.id]?.name || row.name}
                            onChange={(e) =>
                              handleEdit(row.id, "name", e.target.value)
                            }
                          />
                        ) : (
                          row.name
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <React.Fragment>
                            <input
                              accept="image/*"
                              style={{ display: "none" }}
                              id={`raised-button-file-${row.id}`}
                              type="file"
                              onChange={(e) => handleImageUpload(row.id, e)}
                            />
                            <label htmlFor={`raised-button-file-${row.id}`}>
                              <Button
                                variant="contained"
                                color="secondary"
                                component="span"
                              >
                                Trocar Imagem
                              </Button>
                            </label>
                            {editedImages[row.id] ? (
                              <img
                                src={editedImages[row.id]}
                                alt="preview"
                                style={{ width: "100px" }}
                              />
                            ) : (
                              row.image && (
                                <img
                                  src={row.image}
                                  alt="preview"
                                  style={{ width: "100px" }}
                                />
                              )
                            )}
                          </React.Fragment>
                        ) : (
                          <React.Fragment>
                            <Button
                              onClick={() => {
                                Swal.fire({
                                  imageUrl: row.image,
                                  imageAlt: "Imagem do usuário",
                                  showConfirmButton: false,
                                });
                              }}
                            >
                              <PreviewIcon color="action" />
                            </Button>
                          </React.Fragment>
                        )}
                      </TableCell>
                      <TableCell>
                        {editingRow === row.id ? (
                          <React.Fragment>
                            <IconButton
                              onClick={async () => {
                                let rowToUpdate = edits[row.id] || row;
                                const response = await fetch(
                                  `http://localhost:5000/user`,
                                  {
                                    method: "PUT",
                                    body: JSON.stringify({
                                      ...rowToUpdate,
                                      id: row.id,
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
                                      "Usuário atualizado com sucesso!",
                                      "success"
                                    );
                                    setEditingRow(null);
                                    fetchUsers();
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
                                  `http://localhost:5000/user?id=${row.id}`,
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
                                    fetchUsers();
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

export default Users;