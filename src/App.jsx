import { useState, useEffect } from "react";
import Login2 from "./Login2";
import Login from "./Login";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./Home";
import CryptoJS from "crypto-js";
import Cookies from "js-cookie";

function App() {
  //estado para guardar si está logeado o no, true o false
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  //Para guardar la conexión y pasarla a los hijos
  const [dbConfig, setDbConfig] = useState(null);
  //datos predeterminados
  const [formData, setFormData] = useState({
    host: "localhost",
    user: "Ely",
    password: "1234",
    port: "3306",
    database: "prestamosdb",
  });
  //Nueva funcion para deslogearte y a se la pasamos al home
  const handleLogout = () => {
    setIsLoggedIn(false);
    Cookies.remove("isLoggedIn"); // Elimina la cookie al cerrar sesión
  };
  //este el useeffect un dedfgdfgdfgmonio por ejemplo pero para
  //comprobar si la cookie(variable que se guarda en navegador) está presente al cargar la app
  useEffect(() => {
    const loggedInState = Cookies.get("isLoggedIn");
    if (loggedInState === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            //operador ternario
            !isLoggedIn ? (
              <Login2
                dbConfig={dbConfig}
                onConnect={setDbConfig}
                formData={formData}
                setFormData={setFormData}
                setIsLoggedIn={setIsLoggedIn}
              />
            ) : (
              <Navigate to="/home" />
            )
          }
        />
        <Route
          path="/home"
          element={
            isLoggedIn ? (
              <Home
                logeado={isLoggedIn}
                setLogeado={handleLogout}
                dbConfig={dbConfig}
              />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
