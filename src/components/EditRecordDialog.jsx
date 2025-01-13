import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import axios from "axios";

function EditRecordDialog({
  sorteo,
  open,
  onClose,
  dbConfig,
  handleTableChange,
}) {
  const [formData, setFormData] = useState({
    nombre: "",
    isActive: false,
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

  useEffect(() => {
    console.log("selected sorteo", sorteo);
    if (sorteo) {
      setFormData({
        nombre: sorteo.nombre,
        isActive: sorteo.isActive,
        descripcion: sorteo.descripcion,
      });
    }
  }, [sorteo, open]);

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

  const handleSubmit = () => {
    axios
      .put(`http://localhost:5000/sorteos/${sorteo.ID_SORTEO}`, {
        data: formData,
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          handleTableChange(); // Refrescar la tabla
          cerrarModalLimpiar(); // Cerrar el modal
          alert("Sorteo actualizado correctamente");
        }
      })
      .catch((error) => {
        console.log("error", error);
        alert("Error al actualizar el sorteo", error);
      });
  };

  return (
    <Dialog open={open} onClose={cerrarModalLimpiar}>
      <DialogTitle>Editar Sorteo</DialogTitle>
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
              label={formData.isActive ? "Sorteo Activo" : "Sorteo Inactivo"}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={cerrarModalLimpiar} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Guardar cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EditRecordDialog;
