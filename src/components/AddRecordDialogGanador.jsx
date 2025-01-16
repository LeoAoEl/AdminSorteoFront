import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";

function AddRecordDialog({ open, onClose, sorteo }) {
  const [ganadores, setGanadores] = useState([]); // Estado para almacenar los ganadores

  const [formData, setFormData] = useState({
    ID_SORTEO: "",
    nombre: "",
    celular: "",
    correo: "",
    lugar: "", // Nuevo campo para el lugar del ganador
  });

  function cerrarModalLimpiar() {
    setFormData({
      ID_SORTEO: "",
      nombre: "",
      celular: "",
      correo: "",
      lugar: "",
    });
    onClose();
    setGanadores([]);
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (open) {
      setFormData((prevState) => ({
        ...prevState, // Mantén los valores anteriores
        ID_SORTEO: sorteo.ID_SORTEO, // Actualiza solo el ID_SORTEO
      }));

      // Obtener lista de ganadores filtrada por ID_SORTEO
      axios
        .get("http://localhost:5000/ganadores", {
          params: { ID_SORTEO: sorteo.ID_SORTEO },
        })
        .then((response) => {
          // Ordenar ganadores por lugar
          const sortedGanadores = response.data.sort(
            (a, b) => a.lugar - b.lugar
          );
          setGanadores(sortedGanadores);
        })
        .catch((error) => {
          console.error("Error al obtener ganadores:", error);
        });
    }
  }, [open, sorteo]);

  const handleSubmit = () => {
    // Validar que todos los campos estén completos
    const { ID_SORTEO, nombre, celular, correo, lugar } = formData;

    if (!ID_SORTEO || !nombre || !celular || !correo || !lugar) {
      alert("Todos los campos son obligatorios. Por favor, complétalos.");
      return;
    }
    axios
      .post("http://localhost:5000/ganadores", {
        data: formData,
      })
      .then((response) => {
        if (response.data.error) {
          alert(response.data.error);
        } else {
          // Actualizar la lista de ganadores con el nuevo registro
          setGanadores((prevGanadores) => {
            const updatedGanadores = [
              ...prevGanadores,
              {
                nombre: formData.nombre,
                celular: formData.celular,
                correo: formData.correo,
                sorteo: sorteo.nombre,
                lugar: formData.lugar, // Incluye el lugar
              },
            ];
            // Ordenar los ganadores por lugar
            return updatedGanadores.sort((a, b) => a.lugar - b.lugar);
          });
          // Mostrar mensaje de éxito
          alert("Ganador agregado correctamente");
        }
      })
      .catch((error) => {
        alert("Error al guardar registro nuevo", error);
      });
  };

  const handleDelete = (id) => {
    axios
      .delete(`http://localhost:5000/ganadores/${id}`)
      .then((response) => {
        alert("Ganador eliminado correctamente.");
        setGanadores((prevGanadores) =>
          prevGanadores.filter((g) => g.ID_GANADOR !== id)
        );
      })
      .catch((error) => {
        alert("Error al eliminar el ganador.", error);
      });
  };
  return (
    <Dialog open={open} onClose={cerrarModalLimpiar}>
      <DialogTitle>Ganadores de : {sorteo ? sorteo.nombre : ""} </DialogTitle>
      <DialogContent>
        <Grid container spacing={2} style={{ marginTop: 10 }}>
          <Grid item xs={12}>
            <TextField
              label="Lugar del ganador (1°, 2°, 3°)"
              name="lugar"
              type="number"
              value={formData.lugar}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Nombre del ganador"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Celular"
              name="celular"
              value={formData.celular}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Correo"
              name="correo"
              value={formData.correo}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid>
        </Grid>
        {/* Mostrar lista de ganadores */}
        {ganadores.length === 0 ? (
          <h3>No hay ganadores registrados aún para este sorteo.</h3>
        ) : (
          <h3>Lista de ganadores:</h3>
        )}
        <List>
          {ganadores.map((ganador) => (
            <ListItem key={ganador.ID_GANADOR}>
              <ListItemText
                primary={`Lugar: ${ganador.lugar}° - Nombre: ${ganador.nombre}`}
                secondary={`Celular: ${ganador.celular}, Correo: ${ganador.correo}`}
              />
              <IconButton
                onClick={() => handleDelete(ganador.ID_GANADOR)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={cerrarModalLimpiar} color="primary">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Agregar Nuevo Ganador
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default AddRecordDialog;
