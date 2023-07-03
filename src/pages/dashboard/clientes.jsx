import React, { useState, useEffect } from "react";
import Dashboard from "../../components/layout/dashboard";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Typography, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Swal from "sweetalert2";

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [edits, setEdits] = useState({});
  const [editingRow, setEditingRow] = useState(null);

  const onEditCellChangeCommitted = React.useCallback(
    ({ id, field, props }) => {
      if (editingRow === id) {
        setEdits((state) => ({
          ...state,
          [id]: { ...state[id], [field]: props.value },
        }));
      }
    },
    [editingRow]
  );

  useEffect(() => {
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
  }, []);

  const columns = [
    ...Object.keys(clientes[0] || {}).map((key) => ({
      field: key,
      headerName: key,
      width: 150,
      editable: true,
    })),
    {
      field: "action",
      headerName: "Ação",
      sortable: false,
      width: 100,
      disableClickEventBubbling: true,
      renderCell: (params) => {
        if (editingRow === params.id) {
          return (
            <React.Fragment>
              <IconButton
                onClick={async () => {
                  const rowToUpdate = edits[params.id] || params.row;
                  const response = await fetch(
                    `http://localhost:5000/cliente/`,
                    {
                      method: "PUT",
                      body: JSON.stringify({
                        cliente_id: rowToUpdate.id,
                        ...rowToUpdate,
                      }),
                      headers: {
                        "Content-Type": "application/json",
                      },
                    }
                  );
                  const data = await response.json();
                  if (data.mensagem || data[0]?.msg) {
                    Swal.fire("Error", data.mensagem || data[0]?.msg, "error");
                  } else {
                    setEditingRow(null);
                    Swal.fire(
                      "Success",
                      "Registro atualizado com sucesso!",
                      "success"
                    );
                    setClientes((prevClientes) =>
                      prevClientes.map((cliente) =>
                        cliente.id === rowToUpdate.id ? rowToUpdate : cliente
                      )
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
          );
        }

        return (
          <React.Fragment>
            <IconButton
              onClick={() => {
                setEditingRow(params.id);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={async () => {
                const response = await fetch(
                  `http://localhost:5000/cliente?cliente_id=${params.id}`,
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
                }
              }}
            >
              <DeleteIcon />
            </IconButton>
          </React.Fragment>
        );
      },
    },
  ];

  return (
    <Dashboard>
      <div style={{ maxHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5">Clientes</Typography>
          <DataGrid
            onEditCellChangeCommitted={onEditCellChangeCommitted}
            rows={clientes}
            columns={columns}
            loading={loading}
            pageSize={5}
            rowsPerPageOptions={[5, 10]}
            checkboxSelection
          />
        </Container>
      </div>
    </Dashboard>
  );
};

export default Clientes;
