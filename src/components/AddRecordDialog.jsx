import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Typography,
  FormControlLabel,
  Switch,
} from "@mui/material";
import axios from "axios";
function AddRecordDialog({
  tableName,
  open,
  onClose,
  dbConfig,
  handleTableChange,
}) {
  //mapea los inputs dinamicamente
  const [tableStructure, setTableStructure] = useState([]);
  //para guardar los datos de los inpits
  const [formData, setFormData] = useState({
    nombre: "",
    isActive: false, // Estado inicial del switch
    descripcion: "",
  });
  function cerrarModalLimpiar() {
    setFormData({
      nombre: "",
      isActive: false, // Estado inicial del switch
      descripcion: "",
    });
    onClose();
  }

  // Obtener la estructura de la tabla seleccionada
  /*  useEffect(() => {
    if (tableName && open) {
      const configDb = {
        port: dbConfig.port,
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        //selectedDB,
      };
      axios
        .post("http://localhost:5000/getTableStructure", {
          ...configDb,
          tableName: tableName,
        })
        .then((response) => {
          setTableStructure(response.data.structure);
          // Inicializar el estado de los datos del formulario con los campos vacíos
          const initialFormData = response.data.structure.reduce((acc, col) => {
            acc[col.Field] = "";
            return acc;
          }, {});
          //despues del calculo dinamico mapea el formulario del modal
          setFormData(initialFormData);
        })
        .catch((error) => {
          console.error("Error obteniendo la estructura de la tabla", error);
        });
    }
  }, [tableName, open]); */

  // Manejar el cambio en los valores del formulario
  // Manejar el cambio en los valores del formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const handleSwitchChange = (e) => {
    setFormData({
      ...formData,
      isActive: e.target.checked,
    });
  };

  // Manejar la creación del nuevo registro
  const handleSubmit = () => {
    // Aquí puedes realizar validaciones si es necesario

    axios
      .post("http://localhost:5000/sorteos", {
        data: formData,
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          //para recargar la tabla
          handleTableChange();
          cerrarModalLimpiar(); // Cerrar el diálogo
          alert("Sorteo registrado correctamente", response.data);
        }
      })
      .catch((error) => {
        alert("Error al guardar registro nuevo", response.data);
      });
  };

  return (
    <Dialog open={open} onClose={cerrarModalLimpiar}>
      <DialogTitle>Agregar Nuevo Sorteo</DialogTitle>
      <DialogContent style={{ width: 400 }}>
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          <Grid item xs={12}>
            <TextField
              label="Nombre del Sorteo"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Descripcion del sorteo"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={formData.isActive}
                  onChange={handleSwitchChange}
                  name="isActive"
                  color="primary"
                />
              }
              label="¿Establecer como sorteo activo?"
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={cerrarModalLimpiar} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddRecordDialog;
