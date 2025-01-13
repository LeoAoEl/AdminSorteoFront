import "./Login2.css"; // Importamos el CSS
import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { useMediaQuery } from "@mui/material";
const Login2 = ({ formData, setFormData, onConnect, setIsLoggedIn }) => {
  // Crea el tema que responde a los cambios de color
  // Verifica el esquema de color del sistema
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Crea el tema basado en el esquema de color
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light", // Se ajusta al esquema del sistema
    },
  });
  //Detecta cambios en los textbox del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  //cuando doy enter o click en conectar
  const handleSubmit = async (e) => {
    setIsLoggedIn(true);
    /* e.preventDefault();
    try {
      //con esto mando a llamar el método post y envio los datos del formulario
      const response = await axios.post(
        "http://localhost:5000/connect",
        formData
      );
      alert(response.data.message);
      onConnect(formData); // Pasar datos al padre para usarlos globalmente
      //si tengo credenciales correctas me logea y me manda al home
      setIsLoggedIn(true);
    } catch (error) {
      setIsLoggedIn(false);
      alert(`Error: ${error.response?.data?.error || error.message}`);
    } */
  };
  return (
    <div className="login-container">
      <div className="login-card">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Centrar horizontalmente
          }}
        >
          <h2>Administrador de Sorteo</h2>
        </div>
        <ThemeProvider theme={theme}>
          <Container>
            <form onSubmit={handleSubmit}>
              {/*  <TextField
                name="host"
                label="Host"
                value={formData.host}
                onChange={handleChange}
                required
                margin="normal" // Agrega espacio vertical
                fullWidth
              /> */}
              <TextField
                name="user"
                label="Usuario"
                value={formData.user}
                onChange={handleChange}
                required
                margin="normal" // Agrega espacio vertical
                fullWidth
              />
              <TextField
                name="password"
                label="Contraseña"
                type="password"
                value={formData.password}
                onChange={handleChange}
                margin="normal" // Agrega espacio vertical
                fullWidth
              />
              {/*  <TextField
                name="port"
                label="Puerto"
                value={formData.port}
                onChange={handleChange}
                required
                margin="normal" // Agrega espacio vertical
                fullWidth
              />
              <TextField
                name="database"
                label="Base de Datos"
                value={formData.database}
                onChange={handleChange}
                required
                margin="normal" // Agrega espacio vertical
                fullWidth
              /> */}
              <Button
                //Validacion
                disabled={Object.values(formData).some(
                  (value) => value.trim() === ""
                )}
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                Entrar
              </Button>
            </form>
          </Container>
        </ThemeProvider>
      </div>
    </div>
  );
};

export default Login2;
