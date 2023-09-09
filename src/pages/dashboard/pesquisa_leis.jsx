'use client'
import React, { useState } from "react";
import {
  Box,
  Container,
  Table,
  CircularProgress,
  TablePagination,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import Dashboard from "../../components/layout/dashboard"
import LexmlForm from "../../components/forms/LexmlForm";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.secondary.main,
  color: theme.palette.common.white,
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
}));

export const PesquisaLeis = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false); 
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

  return (
    <Dashboard>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Pesquisa de Leis
        </Typography>
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
          <>
            <LexmlForm
              results={results}
              setResults={setResults}
              setLoading={setLoading}
            />
            <TableContainer component={Paper} sx={{ mt: 4 }}>
              <Table>
                <TableHead>
                  <StyledTableRow>
                    {results.length > 0 &&
                      Object.keys(results[0]).map((key) => (
                        <StyledTableCell key={key}>{key}</StyledTableCell>
                      ))}
                  </StyledTableRow>
                </TableHead>
                <TableBody>
                  {results.length > 0 ? (
                    results
                      .slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                      .map((doc, index) => (
                        <StyledTableRow key={index}>
                          {Object.keys(results[0]).map((key, idx) => {
                            const value = doc[key];
                            return (
                              <TableCell key={idx}>
                                {value ? (
                                  key === "Link" ||
                                  key === "MaisDetalhes" ||
                                  (typeof value === "string" &&
                                    (value.startsWith("http://") ||
                                      value.startsWith("https://"))) ? (
                                    <a
                                      href={value}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {value}
                                    </a>
                                  ) : (
                                    value
                                  )
                                ) : (
                                  "Não informado"
                                )}
                              </TableCell>
                            );
                          })}
                        </StyledTableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        Não existem resultados para a pesquisa
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={results.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </TableContainer>
          </>
        )}
      </Container>
    </Dashboard>
  );
};

export default PesquisaLeis;
