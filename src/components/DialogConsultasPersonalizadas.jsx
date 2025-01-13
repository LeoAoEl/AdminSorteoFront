import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Box,
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useMediaQuery } from "@mui/material";

import axios from "axios";

function UpdateRecordDialog({
  tableName,
  open,
  onClose,
  dbConfig,
  handleTableChange,
  customLocaleText,
  selectedRow, // Registro completo de la fila seleccionada
}) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSelectEnabled, setIsSelectEnabled] = useState(false);
  const [isActionEnabled, setIsActionEnabled] = useState(false);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Crea el tema basado en el esquema de color
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light", // Se ajusta al esquema del sistema
    },
  });
  // Función que valida la consulta y habilita los botones
  useEffect(() => {
    const normalizedQuery = query.trim().toLowerCase();
    // Habilitar/Deshabilitar el botón de 'SELECT'
    setIsSelectEnabled(normalizedQuery.startsWith("select"));
    // Habilitar/Deshabilitar el botón de 'INSERT, UPDATE, DELETE'
    const validActions = ["insert", "update", "delete"];
    const isActionQuery = validActions.some((action) =>
      normalizedQuery.startsWith(action)
    );
    setIsActionEnabled(isActionQuery);
  }, [query]);
  const handleSelectSubmit = async () => {
    setLoading(true);
    setError("");
    setResult([]);

    try {
      const response = await axios.post("http://localhost:5000/executeQuery", {
        query,
        ...dbConfig,
      });
      const rowsWithId = response.data.data.map((item, index) => ({
        ...item,
        id: index, // Usar el índice como id único
      }));
      // setTableData(rowsWithId); // Guardamos los datos con id
      setResult(rowsWithId);
      console.log("results", rowsWithId);
      setLoading(false);
    } catch (err) {
      setLoading(false);

      setError(err.response?.data?.error || "Error ejecutando la consulta.");
    }
    setLoading(false);
  };

  const handleActionSubmit = async () => {
    try {
      const response = await axios.post("http://localhost:5000/executeAction", {
        query,
        ...dbConfig,
      });
      setError(
        response.data.message +
          "....Para ver los resultados de tu comando sql en la primera tabla de visualización automatica,o bien ejecutando manualmente una sentencia sql desde aquí."
      );
    } catch (err) {
      setError(err.response?.data?.error || "Error ejecutando el comando.");
    }
  };

  function cerrarYlimpiar(params) {
    onClose();
    setError("");
    setResult([]);
    setQuery("");
    handleTableChange();
  }

  return (
    <ThemeProvider theme={theme}>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>
          {" "}
          <Typography variant="h6">CONSULTAS PERSONALIZADAS</Typography>
        </DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              label="Consulta SQL"
              multiline
              rows={4}
              fullWidth
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Escribe tu consulta o comando SQL aquí"
              variant="outlined"
              margin="normal"
              onFocus={() => setError("")}
            />
            {error && (
              <Typography variant="body2" gutterBottom>
                {error}
              </Typography>
            )}

            <div style={{ height: "calc(100vh - 350px)", width: "100%" }}>
              <DataGrid
                //Pasamos la data de la tabla seleccionada a pintar
                rows={result}
                //columnas dinamicas
                columns={Object.keys(result[0] || {}).map((key) => ({
                  field: key,
                  headerName: key.charAt(0).toUpperCase() + key.slice(1),
                  width: 200,
                }))}
                //Numero por default para ver cuantos datos queremos pintar de inicio
                initialState={{
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                //estado del spinne
                loading={loading}
                //traducciones a español
                localeText={customLocaleText}
                //opciones de paginacion
                pageSizeOptions={[5, 10, 100, { value: -1, label: "Todos" }]}
                //para habilitar la seleccion mediante un checkbox
                //  checkboxSelection
              />
            </div>
          </Box>
        </DialogContent>
        <DialogActions>
          <Grid
            container
            spacing={4}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSelectSubmit}
                disabled={!isSelectEnabled}
              >
                Ejecutar SELECT
              </Button>
            </Grid>
            <Grid item>
              <Button
                disabled={!isActionEnabled}
                variant="contained"
                color="secondary"
                onClick={handleActionSubmit}
              >
                Ejecutar Comando (INSERT, UPDATE, DELETE)
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                onClick={() => cerrarYlimpiar()}
              >
                SALIR
              </Button>
            </Grid>
          </Grid>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default UpdateRecordDialog;
