import TableSelector from "./components/TableSelector";
const Home = ({ setLogeado, dbConfig }) => {
  //Funcion cuando hace click en cerrar sesión para ir al login de nuevo
  const handleLogout = () => {
    setLogeado(false); // Cambia el estado de logeado a false
  };

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        margin: 0,
        padding: 0,
        display: "flex",
        flexDirection: "column", // Organiza la navbar arriba del iframe
        gap: 20,
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          height: "50px",
          backgroundColor: "#3c3c3c", // Fondo transparente
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <h2>Sorteos los Volcanes-Panel Administrador</h2>
        </div>
        <div>
          {/* Botón de Cerrar Sesión */}
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#002639", // Fondo negro
              color: "white", // Texto blanco

              borderRadius: "20px", // Bordes redondeados
              padding: "8px 15px", // Espaciado interno

              cursor: "pointer", // Cambia el cursor a pointer al pasar el ratón
              transition: "background-color 0.3s, transform 0.2s", // Transiciones suaves
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#4c5454")} // Efecto hover (gris oscuro)
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#002639")} // Volver a negro
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <TableSelector dbConfig={dbConfig} />
      </div>
    </div>
  );
};

export default Home;
