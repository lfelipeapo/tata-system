'use client'
import React, { useState } from "react";
import Dashboard from "../../components/layout/dashboard";
import {
  Box,
  CircularProgress,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { getNormaByCodigo } from "../../services/senadoService";
import SenadoForm from "../../components/forms/SenadoForm";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const Leis = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [termos, setTermos] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openSubModal, setOpenSubModal] = useState(false);
  const [normaDetails, setNormaDetails] = useState(null);
  const [subModalDetails, setSubModalDetails] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Handle page change
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = async (codigo) => {
    try {
      const response = await getNormaByCodigo(codigo);
      setNormaDetails(response.data.DetalheDocumento.DOCUMENTOS.documento);
      setOpenModal(true);
    } catch (error) {
      console.error("Erro ao buscar detalhes da norma:", error);
      Swal.fire({
        icon: "error",
        title: "Erro!",
        text: "Ocorreu um erro ao buscar os detalhes da norma.",
      });
    }
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setNormaDetails(null);
  };

  const handleOpenSubModal = (details) => {
    setSubModalDetails(details);
    setOpenSubModal(true);
  };

  const handleCloseSubModal = () => {
    setOpenSubModal(false);
    setSubModalDetails(null);
  };

  const renderNormaDetails = (details) => {
    const entries = Object.entries(details);
    return entries.map(([key, value]) => {
      if (value && typeof value === "object") {
        if (Array.isArray(value)) {
          if (value.length > 0 && typeof value[0] === "object") {
            return (
              <StyledTableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>
                  {value.map((obj, index) => (
                    <div key={index} style={{ marginBottom: 5 }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleOpenSubModal(obj)}
                      >
                        Detalhes {index + 1}
                      </Button>
                    </div>
                  ))}
                </TableCell>
              </StyledTableRow>
            );
          } else {
            return (
              <StyledTableRow key={key}>
                <TableCell>{key}</TableCell>
                <TableCell>{value.join(", ")}</TableCell>
              </StyledTableRow>
            );
          }
        } else {
          return renderNormaDetails(value);
        }
      } else {
        return (
          <StyledTableRow key={key}>
            <TableCell>{key}</TableCell>
            <TableCell>{value}</TableCell>
          </StyledTableRow>
        );
      }
    });
  };

  return (
    <Dashboard>
      <div style={{ minHeight: 600, width: "100%" }}>
        <Container sx={{ mt: 4, mb: 4 }}>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Consulta Leis
          </Typography>
          <Grid
            container
            justifyContent="space-between"
            alignItems="flex-start"
          >
            <SenadoForm
              results={results}
              setResults={setResults}
              termos={termos}
              setTermos={setTermos}
              setLoading={setLoading}
            />
            {results.length > 0 && (
              <TextField
                sx={{ ml: 3, mt: 1, mb: 4 }}
                label="Termos"
                variant="outlined"
                color="secondary"
                value={termos}
                onChange={(e) => setTermos(e.target.value)}
              />
            )}
          </Grid>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome da Norma</TableCell>
                  <TableCell>Data da Assinatura</TableCell>
                  <TableCell>Tipo</TableCell>
                  <TableCell>Ementa</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Número</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "50vh",
                        }}
                      >
                        <CircularProgress />
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : results.length > 0 ? (
                  results
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((doc) => (
                      <TableRow key={doc["@id"]}>
                        <TableCell>{doc.normaNome}</TableCell>
                        <TableCell>{doc.dataassinatura}</TableCell>
                        <TableCell>{doc.tipo}</TableCell>
                        <TableCell>{doc.ementa}</TableCell>
                        <TableCell>{doc.descricao}</TableCell>
                        <TableCell>{doc.numero}</TableCell>
                        <TableCell>
                          <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => handleOpenModal(doc["@id"])}
                          >
                            Detalhes
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      Não existem resultados para a pesquisa
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={results.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </Table>
          </TableContainer>
        </Container>
      </div>

      <Dialog
        open={openModal}
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalhes da Norma</DialogTitle>
        <DialogContent>
          {normaDetails && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Campo</StyledTableCell>
                    <StyledTableCell>Detalhes</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>{renderNormaDetails(normaDetails)}</TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openSubModal}
        onClose={handleCloseSubModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Detalhes</DialogTitle>
        <DialogContent>
          {subModalDetails && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    <StyledTableCell>Campo</StyledTableCell>
                    <StyledTableCell>Detalhes</StyledTableCell>
                  </StyledTableRow>
                </TableHead>
                <TableBody>{renderNormaDetails(subModalDetails)}</TableBody>
              </Table>
            </TableContainer>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSubModal} color="secondary">
            Fechar
          </Button>
        </DialogActions>
      </Dialog>
    </Dashboard>
  );
};

export default Leis;
