import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
} from "@mui/material";
import axios from "axios";

function UpdateRecordDialog({
  tableName,
  open,
  onClose,
  dbConfig,
  handleTableChange,
  selectedRow, // Registro completo de la fila seleccionada
}) {
  const [tableStructure, setTableStructure] = useState([]);
  const [formData, setFormData] = useState({});
  const [keyFields, setKeyFields] = useState([]);
  const [originalKeyValues, setOriginalKeyValues] = useState({}); // Nuevos valores originales

  // Obtener la estructura de la tabla y mapear los datos seleccionados
  useEffect(() => {
    if (tableName && open) {
      const configDb = {
        port: dbConfig.port,
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
      };

      axios
        .post("http://localhost:5000/getTableStructure", {
          ...configDb,
          tableName: tableName,
        })
        .then((response) => {
          setTableStructure(response.data.structure);

          // Mapear valores del registro seleccionado a formData
          const mappedData = response.data.structure.reduce((acc, column) => {
            acc[column.Field] = selectedRow[0]?.[column.Field] ?? ""; // Usar valor de selectedRow o vacío
            return acc;
          }, {});

          setFormData(mappedData);

          // Establecer los primeros 2 campos como claves para el update
          const keys = response.data.structure
            .slice(0, 2)
            .map((col) => col.Field);
          setKeyFields(keys);

          // Guardar los valores originales de las claves
          const originalKeys = keys.reduce((acc, key) => {
            acc[key] = selectedRow[0]?.[key];
            return acc;
          }, {});
          setOriginalKeyValues(originalKeys);
        })
        .catch((error) => {
          console.error("Error obteniendo la estructura de la tabla", error);
        });
    }
  }, [tableName, open, selectedRow]);

  // Manejar cambios en los valores del formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Manejar la actualización del registro
  const handleSubmit = () => {
    const configDb = {
      port: dbConfig.port,
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    };

    axios
      .post("http://localhost:5000/updateData", {
        ...configDb,
        tableName,
        data: formData,
        keyFields,
        originalKeyValues, // Enviar los valores originales de las claves
      })
      .then((response) => {
        alert("Registro actualizado correctamente");
        handleTableChange(); // Refrescar la tabla
        onClose(); // Cerrar el diálogo
      })
      .catch((error) => {
        alert("Error al actualizar el registro", error.response.data);
      });
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Actualizar Registro</DialogTitle>
      <DialogContent>
        <Grid style={{ marginTop: 10 }} container spacing={2}>
          {tableStructure.map((column) => (
            <Grid item xs={12} sm={6} key={column.Field}>
              <TextField
                label={column.Field}
                name={column.Field}
                value={formData[column.Field] || ""}
                onChange={handleInputChange}
                fullWidth
                required={keyFields.includes(column.Field)} // Marcar campos clave como obligatorios
              />
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default UpdateRecordDialog;
