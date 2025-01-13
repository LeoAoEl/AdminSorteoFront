import React, { useState } from "react";
import axios from "axios";
import { TextField, Button, Container } from "@mui/material";

const ConnectionForm = ({ onConnect }) => {
  const [formData, setFormData] = useState({
    host: "localhost",
    user: "root",
    password: "root",
    database: "prestamosdb",
    port: "3306",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/connect",
        formData
      );
      alert(response.data.message);
      onConnect(formData); // Pasar datos al padre para usarlos globalmente
    } catch (error) {
      alert(`Error: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField
          name="host"
          label="Host"
          value={formData.host}
          onChange={handleChange}
          fullWidth
          required
          margin="normal" // Agrega espacio vertical
        />
        <TextField
          name="user"
          label="Usuario"
          value={formData.user}
          onChange={handleChange}
          fullWidth
          required
          margin="normal" // Agrega espacio vertical
        />
        <TextField
          name="password"
          label="Contraseña"
          type="password"
          value={formData.password}
          onChange={handleChange}
          fullWidth
          margin="normal" // Agrega espacio vertical
        />
        <TextField
          name="port"
          label="Puerto"
          value={formData.port}
          onChange={handleChange}
          fullWidth
          required
          margin="normal" // Agrega espacio vertical
        />
        <TextField
          name="database"
          label="Base de Datos"
          value={formData.database}
          onChange={handleChange}
          fullWidth
          required
          margin="normal" // Agrega espacio vertical
        />
        <Button
          disabled={Object.values(formData).some(
            (value) => value.trim() === ""
          )}
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
        >
          Conectar
        </Button>
      </form>
    </Container>
  );
};

export default ConnectionForm;
