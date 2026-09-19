import express from "express";
import {
    buscarLocationPorId,
    buscarLocationPorNombreJoin,
    insertarLocation,
    actualizarLocation,
    eliminarLocation
} from "./controllers.js";

// Configura las rutas de la API en el app Express.
function configurarRutas(app) {
    app.get("/api/location/id/:id", buscarLocationPorId);
    app.get("/api/location/name/:name", buscarLocationPorNombreJoin);
    app.post("/api/location", insertarLocation);
    app.put("/api/location/id/:id", actualizarLocation);
    app.delete("/api/location/id/:id", eliminarLocation);

    app.get("/api/salud", function (req, res) {
        res.send("La app logra recibir solicitudes correctamente.");
    });
}

const app = express();   // Crea el servidor
app.use(express.json()); // Permite que app reciba y procese solicitudes en formato JSON
configurarRutas(app);

export default app;
