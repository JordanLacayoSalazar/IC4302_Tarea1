import app from "./server.js";

// Activa el servidor
const server = app.listen(3000, "localhost", function () {
    const host = server.address().address;
    const port = server.address().port;

    console.log("El servidor está en ejecución (en http://%s:%s).", host, port);
});
