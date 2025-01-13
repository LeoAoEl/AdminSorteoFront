import { useState, useEffect } from "react";

import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Grid,
} from "@mui/material";
import logoSphere from "./SphereLogo.png";
// import { Visibility, VisibilityOff } from "@mui/icons-material";
//import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import backgroundVideo from "./SphereSinc.mp4";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="login-container">
      <video
        autoPlay
        loop
        muted
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          zIndex: -1,
        }}
      >
        <source src={backgroundVideo} type="video/mp4" />
      </video>
      <Box sx={{ width: "100vw", height: "100vh", position: "relative" }}>
        {/* Video de fondo */}

        <Grid container sx={{ height: "100%" }}>
          {/* Lado izquierdo */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              //backgroundColor: "rgba(255, 255, 255, 0.9)", // Fondo semitransparente para el login
              backgroundColor: "white",
            }}
          >
            <div className="login-card2">
              {/* Logo */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center", // Centrar horizontalmente
                  gap: 2,
                  marginBottom: 20,
                }}
              >
                <img
                  src={logoSphere}
                  alt="Logo"
                  style={{
                    maxWidth: "35%",
                    maxHeight: "50%",
                    objectFit: "contain", // Asegura que la imagen no se deforme
                    gap: 2,
                  }}
                />
              </div>

              {/* Título */}
              <Typography variant="h5" fontWeight="bold" mb={1}>
                Bienvenido a{" "}
                <span style={{ color: "#471274" }}>SphereSinc</span>
              </Typography>
              <Typography variant="body2" color="textSecondary" mb={3}>
                Accede con tus credenciales
              </Typography>

              {/* Formulario */}
              <Box
                component="form"
                width="100%"
                display="flex"
                flexDirection="column"
                gap={5}
                sx={{
                  padding: "1rem",
                  "@media (min-width: 1200px)": {
                    padding: "1rem", // Aumenta el padding en pantallas grandes
                  },
                }}
              >
                {/* Campo de Username */}

                <TextField label="Username" variant="outlined" fullWidth />

                {/* Campo de Password */}
                <TextField
                  label="Password"
                  variant="outlined"
                  type={showPassword ? "text" : "password"}
                  fullWidth
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleTogglePasswordVisibility}
                          edge="end"
                        >
                          {showPassword ? (
                            <VisibilityOffIcon />
                          ) : (
                            <VisibilityIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {/* Botón de Login */}
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    bgcolor: "#2C2F64",
                    "&:hover": { bgcolor: "#303F9F" },
                  }}
                >
                  LOGIN
                </Button>

                {/* Olvidaste contraseña */}
                <Typography
                  variant="body2"
                  align="center"
                  style={{ color: "#471274" }}
                  sx={{ mt: 1, cursor: "pointer" }}
                >
                  ¿Olvidaste la contraseña?
                </Typography>
              </Box>
            </div>
          </Grid>

          {/* Lado derecho vacío */}
          {/* El lado derecho desaparece en pantallas pequeñas */}
          <Grid
            item
            md={6} // Visible solo en pantallas medianas y grandes
            sx={{
              display: { xs: "none", md: "block" }, // Oculta el lado derecho en pantallas pequeñas
            }}
          ></Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Login;
