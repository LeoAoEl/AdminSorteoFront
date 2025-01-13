import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Select,
  MenuItem,
  Button,
  Container,
  InputLabel,
  Box,
  Grid,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Typography } from "@mui/material";
import AddRecordDialog from "./AddRecordDialog";
import UpdateRecordDialog from "./UpdateRecordDialog";
import DialogConsultasPersonzalidas from "./DialogConsultasPersonalizadas";
import { useMediaQuery } from "@mui/material";
import "./styles.css";
import EditRecordDialog from "./EditRecordDialog";

const TableSelector = ({ dbConfig }) => {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Crea el tema basado en el esquema de color
  const theme = createTheme({
    palette: {
      mode: prefersDarkMode ? "dark" : "light", // Se ajusta al esquema del sistema
    },
  });
  //para guardar mi listado de tablas disponibles
  const [tables, setTables] = useState([]);
  //para guardar la tabla seleccionada
  const [selectedTable, setSelectedTable] = useState("");
  //para guardar los datos de la tabla seleccionada
  const [tableData, setTableData] = useState([]);
  //Para representar el spinner de carga
  const [loading, setLoading] = useState(false);
  //abrir modal de agregar datos
  const [abrirModal, setabrirModal] = useState(false);
  //para guardar los registros seleccionados y eliminarlos al darle click al boton
  const [selectedRows, setSelectedRows] = useState([]);

  const [updateDialogOpen, setUpdateDialogOpen] = useState(false);
  const [updateDialogOpenPersonalizadas, setUpdateDialogOpenPersonalizadas] =
    useState(false);
  const [abrirModalEditar, setAbrirModalEditar] = useState(false);
  const [selectedSorteo, setSelectedSorteo] = useState(null);
  const titleStyle = {
    fontSize: "24px",
    fontWeight: "normal", // Texto normal para el título

    textAlign: "center", // Centrado del texto
    padding: "10px 0", // Espaciado vertical
  };

  const boldTextStyle = {
    fontWeight: "bold", // Hacer el texto de la base de datos en negritas
  };

  //envia peticion al back para traerme las tablas disponibles de la db actual
  useEffect(() => {
    todosLosSorteos();
    //cada que cambie config desde el login se manda a llamar
    //y cuando entre este componente en pantalla
  }, []);
  const todosLosSorteos = () => {
    axios
      .get("http://localhost:5000/sorteos")
      .then((response) => {
        console.log("res sorteo", response.data);
        setTables(response.data);
        /*   [
        {
          ID_SORTEO: 1,
          nombre: "Sorteo 1",
          fecha_creacion: "2024-12-30T15:08:34.000Z",
        },
      ]; */
      })
      .catch((error) => console.error(error));
  };

  //traerme los datos de la tabla seleccionada
  const handleTableChange = () => {
    const configDb = {
      port: dbConfig.port,
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    };
    if (selectedTable) {
      //para habiliar el spinner de carga
      setLoading(true);
      //llamada al back para traerme todos los datos de la tabla
      axios
        .post("http://localhost:5000/getTableData", {
          ...configDb,
          tableName: selectedTable,
        })
        .then((response) => {
          //mapear su id porque daba error el componente de tabla
          const rowsWithId = response.data.map((item, index) => ({
            ...item,
            id: index, // Usar el índice como id único
          }));
          setTableData(rowsWithId); // Guardamos los datos con id
          //apagas el spinner de carga
          setLoading(false);

          //setTableData(response.data);
        })
        .catch((error) => {
          //si da error apagas el spinner
          setLoading(false);

          console.error("Error fetching table data", error);
        });
    }
  };
  //traducciones para la tabla
  const customLocaleText = {
    noRowsLabel: "No hay filas",
    noResultsOverlayLabel: "No se encontraron resultados",
    errorOverlayDefaultLabel: "Ha ocurrido un error",
    toolbarDensity: "Densidad",
    toolbarColumns: "Columnas",
    toolbarFilters: "Filtros",
    toolbarExport: "Exportar",
    columnMenuLabel: "Menú de columna",
    columnMenuShowColumns: "Mostrar columnas",
    columnMenuFilter: "Filtrar",
    columnMenuHideColumn: "Ocultar columna",
    columnMenuUnsort: "Eliminar orden",
    columnMenuSortAsc: "Orden ascendente",
    columnMenuSortDesc: "Orden descendente",
    footerTotalRows: "Total de filas: {totalRows}",
    paginationRowsPerPage: "Filas por página",
  };

  //función para cerrar el modal
  function handleclosemodal() {
    setabrirModal(false);
  }
  //funcion para abrir modal
  function handleabrirModal() {
    setabrirModal(true);
  }
  //
  function limpiarTablaCuandoCambieSelect(e) {
    const nuevaTabla = e.target.value; // Obtén el valor directamente del evento
    setSelectedTable(nuevaTabla); // Actualiza el estado

    if (nuevaTabla) {
      // Habilitar el spinner de carga
      setLoading(true);

      // Llamada al backend para traer los datos de la tabla seleccionada
      axios
        .get(`http://localhost:5000/boletos/${nuevaTabla}`) // Cambié POST por GET, ya que parece más apropiado
        .then((response) => {
          setTableData(response.data); // Guardar los datos
          setLoading(false); // Apagar el spinner
        })
        .catch((error) => {
          setLoading(false); // Apagar el spinner en caso de error
          console.error("Error fetching table data", error);
        });
    } else {
      setTableData([]); // Limpiar la tabla si no hay tabla seleccionada
    }
  }

  function recargaBoletos() {
    setLoading(true);

    // Llamada al backend para traer los datos de la tabla seleccionada
    axios
      .get(`http://localhost:5000/boletos/${selectedTable}`) // Cambié POST por GET, ya que parece más apropiado
      .then((response) => {
        setTableData(response.data); // Guardar los datos
        setLoading(false); // Apagar el spinner
      })
      .catch((error) => {
        setLoading(false); // Apagar el spinner en caso de error
        console.error("Error fetching table data", error);
      });
  }

  // Filtra mediante los ids seleccionados y crear un nuevo objeto con datos completos
  //para poder eliminar dinamicamente en la base de datos
  const selectedData = tableData.filter((row) => selectedRows.includes(row.id));

  //Funcion para generar las querys deletes dinamicamente y solo funciona para mayor de 3 columnas
  //lo puedo cambiar a las columnas que yo quiera
  const generateDeleteQueries = (selectedData) => {
    if (selectedData.length === 0) return [];

    return selectedData.map((row) => {
      // Filtra claves con valores válidos
      const keys = Object.keys(row).filter(
        (key) => row[key] !== null && row[key] !== undefined && row[key] !== ""
      );

      // Verifica que hay al menos 3 claves válidas
      if (keys.length < 3) {
        throw new Error(
          "La fila seleccionada no tiene suficientes claves válidas para generar el WHERE."
        );
      }

      // Selecciona las primeras 3 claves válidas
      const [key1, key2, key3] = keys;

      return `DELETE FROM ${selectedTable} WHERE ${key1} = '${row[key1]}' AND ${key2} = '${row[key2]}' AND ${key3} = '${row[key3]}';`;
    });
  };

  //Para eliminar los registros seleccionados
  const handleDeleteRows = () => {
    const configDb = {
      port: dbConfig.port,
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password,
      database: dbConfig.database,
    };
    const deleteQueries = generateDeleteQueries(selectedData);
    console.log("query dinamica", deleteQueries);

    if (deleteQueries.length === 0) {
      alert("No hay filas válidas para eliminar.");
      return;
    }

    // Enviar las consultas al backend
    axios
      .post("http://localhost:5000/deleteRows", {
        ...configDb,
        table: selectedTable,
        queries: deleteQueries,
      })
      .then((response) => {
        alert("Fila/s eliminadas exitosamente.");
        // Recargar los datos de la tabla después de eliminar
        handleTableChange();
      })
      //si hay algun error manda al catch
      .catch((error) => {
        console.error("Error al eliminar filas:", error);
        alert("Hubo un error al intentar eliminar las filas.");
      });
  };

  const handleRowClick = (row) => {
    // setSelectedRow(row);
    setUpdateDialogOpen(true);
  };

  const cambiarEstado = async (id) => {
    try {
      // Llamada a la API para cambiar el estado del boleto
      await axios.put(`http://localhost:5000/boletos/${id}/estado`, {
        estado: "confirmado",
      });

      // Actualizar el estado local de la tabla
      setTableData((prev) =>
        prev.map((row) =>
          row.id === id ? { ...row, estado: "confirmado" } : row
        )
      );

      alert("Estado cambiado a confirmado");
    } catch (error) {
      console.error("Error al cambiar el estado", error);
      alert("Hubo un problema al cambiar el estado");
    }
  };

  function setUpdateBolteos() {
    if (selectedRows.length === 0) return; // Verificamos que haya filas seleccionadas

    axios
      .post("http://localhost:5000/boletos/confirmar", { ids: selectedRows })
      .then((response) => {
        console.log("Boletos confirmados:", response.data);
        // Realiza acciones adicionales, como actualizar la tabla o mostrar un mensaje de éxito
        alert(`Se confirmaron ${selectedRows.length} boleto(s) exitosamente.`);
        setSelectedRows([]); // Limpia la selección
        // Opcional: recarga los datos de la tabla
        recargaBoletos();
      })
      .catch((error) => {
        console.error("Error al confirmar boletos:", error);
        alert("Hubo un error al confirmar los boletos. Inténtalo de nuevo.");
      });
  }
  const hiddenColumns = ["Id", "ID_SORTEO"]; // Lista de columnas a ocultar
  const columns = [
    { field: "id", headerName: "ID", width: 50 }, // Ocultar ID
    { field: "ID_SORTEO", headerName: "ID_S", width: 50 }, // Ocultar ID_SORTEO
    { field: "numero_boleto", headerName: "Numero Boleto", width: 150 }, // Ocultar ID
    { field: "estado", headerName: "Estado", width: 100 },
    { field: "nombre", headerName: "Nombre", width: 200 },
    { field: "celular", headerName: "Celular", width: 200 },
    { field: "correo", headerName: "Correo", width: 250 },
    { field: "fecha_apartado", headerName: "Fecha Apartado", width: 200 },
  ];
  const [columnVisibilityModel, setColumnVisibilityModel] = useState({
    id: false, // Ocultar la columna con el campo 'id'
    ID_SORTEO: false, // Ocultar la columna con el campo 'ID_SORTEO'
  });
  const handleAbrirModalEditar = () => setAbrirModalEditar(true);
  const handleCerrarModalEditar = () => setAbrirModalEditar(false);
  const [dataSeleccionada, setDataSeleccionada] = useState([]);
  useEffect(() => {
    const rowsData = selectedRows.map((id) =>
      tableData.find((row) => row.id === id)
    );
    setDataSeleccionada(rowsData); // Actualiza el estado con los datos seleccionados
    console.log("selected rows", rowsData);
  }, [selectedRows, tableData]);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box display="flex" flexDirection="column" gap={2}>
          <div>
            {tables.length == 0 ? (
              <InputLabel id="demo-simple-select-label">
                No existe ningun sorteo creado
              </InputLabel>
            ) : (
              <InputLabel id="demo-simple-select-label">
                Selecciona un sorteo para ver sus boletos
              </InputLabel>
            )}
            <Select
              value={selectedTable}
              onChange={(e) => limpiarTablaCuandoCambieSelect(e)}
              fullWidth
              // disabled={dbConfig == null}
              displayEmpty
            >
              <MenuItem value="" disabled>
                --Selecciona un sorteo--
              </MenuItem>
              {tables.map((table) => (
                <MenuItem key={table.ID_SORTEO} value={table.ID_SORTEO}>
                  <span
                    style={{ fontWeight: table.isActive ? "bold" : "normal" }}
                  >
                    {table.nombre}
                  </span>
                  {table.isActive ? (
                    <span
                      style={{
                        marginLeft: "8px",
                        color: "green",
                        fontSize: "0.9rem",
                      }}
                    >
                      (Activo)
                    </span>
                  ) : null}
                </MenuItem>
              ))}
            </Select>
          </div>
          <Grid container spacing={2} justifyContent="center">
            {/* Botón Ver Datos */}
            {/*  <Grid item>
              <Button
                disabled={selectedTable === "" || loading}
                variant="contained"
                color="primary"
                onClick={() => handleTableChange()}
              >
                Ver Datos
              </Button>
            </Grid> */}

            {/* Botón Agregar (verde) */}
            <Grid item>
              <Button
                //disabled={selectedTable === ""}
                variant="contained"
                color="success" // Color verde
                onClick={() => handleabrirModal()}
              >
                Agregar nuevo sorteo
              </Button>
            </Grid>

            <Grid item>
              <Button
                disabled={!selectedTable}
                variant="contained"
                color="success" // Color verde
                onClick={() => {
                  // Simulación de selección de sorteo
                  const sorteo = tables.find(
                    (sorteo) => sorteo.ID_SORTEO === selectedTable
                  );
                  setSelectedSorteo(sorteo);
                  handleAbrirModalEditar();
                }}
              >
                Editar sorteo seleccionado
              </Button>
            </Grid>

            {/* Botón Eliminar (rojo) */}
            {/*      <Grid item>
              <Button
                disabled={selectedTable === "" || selectedRows.length === 0}
                // disabled={selectedTable === "" || loading}
                variant="contained"
                color="error" // Color rojo
                onClick={() => handleDeleteRows()}
              >
                Eliminar Datos
              </Button>
            </Grid> */}
            {/* Botón Actualizar (rojo) */}
            <Grid item>
              <Button
                disabled={
                  selectedTable === "" ||
                  selectedRows.length === 0 ||
                  dataSeleccionada.some((row) => row?.estado === "libre") // Revisa si hay algún estado "libre"
                }
                variant="contained"
                onClick={() => setUpdateBolteos()}
              >
                Confirmar boleto/s
              </Button>
            </Grid>
            {/*      <Grid item>
              <Button
                disabled={selectedTable === "" || selectedRows.length > 0}
                variant="contained"
                onClick={() => setUpdateDialogOpenPersonalizadas(true)}
              >
                Abrir CONSULTAS PERSONALIZADAS
              </Button>
            </Grid> */}
          </Grid>
          {/* Modal para agregar datos */}
          <AddRecordDialog
            tableName={selectedTable}
            open={abrirModal}
            onClose={handleclosemodal}
            dbConfig={dbConfig}
            handleTableChange={todosLosSorteos}
          />
          <EditRecordDialog
            sorteo={selectedSorteo}
            open={abrirModalEditar}
            onClose={handleCerrarModalEditar}
            dbConfig={dbConfig}
            handleTableChange={todosLosSorteos}
          />
          <UpdateRecordDialog
            tableName={selectedTable}
            open={updateDialogOpen}
            onClose={() => setUpdateDialogOpen(false)}
            dbConfig={dbConfig}
            handleTableChange={handleTableChange}
            selectedRow={selectedData}
          />
          <DialogConsultasPersonzalidas
            tableName={selectedTable}
            open={updateDialogOpenPersonalizadas}
            onClose={() => setUpdateDialogOpenPersonalizadas(false)}
            dbConfig={dbConfig}
            handleTableChange={handleTableChange}
            selectedRow={selectedData}
            customLocaleText={customLocaleText}
          />
          {/*  tabla de material-ui que pinta los datos de la tabla seleccionada */}
          {/* estilo que calcula automaticamente el espacio de la tabla segun la
        pantalla */}
          {console.log("data tabla", tableData)}

          <div style={{ height: "calc(100vh - 250px)", width: "100%" }}>
            <DataGrid
              rows={tableData}
              columns={columns}
              columnVisibilityModel={columnVisibilityModel} // Usar el modelo de visibilidad
              onColumnVisibilityModelChange={(newModel) =>
                setColumnVisibilityModel(newModel)
              } // Actualiza la visibilidad
              getRowClassName={(params) => {
                const baseClass =
                  params.row.estado === "libre"
                    ? "row-libre"
                    : params.row.estado === "apartado"
                    ? "row-apartado"
                    : "row-confirmado";
                return `${baseClass} ${prefersDarkMode ? "dark" : "light"}`;
              }}
              loading={loading}
              localeText={customLocaleText}
              pageSizeOptions={[5, 10, 100, { value: -1, label: "Todos" }]}
              checkboxSelection
              rowSelectionModel={selectedRows} // Sincroniza la selección con el estado
              onRowSelectionModelChange={(newSelection) => {
                setSelectedRows(newSelection);
              }}
            />
          </div>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default TableSelector;
