import {
    db_buscarLocationPorId,
    db_buscarLocationPorNombreJoin,
    db_insertarLocation,
    db_actualizarLocation,
    db_eliminarLocation
} from "./services.js";

const CODIGOS_HTTP = {
    OK: 200,
    OK_CREATED: 201,
    OK_NO_CONTENT: 204,
    ERR_BAD_REQUEST: 400,
    ERR_NOT_FOUND: 404,
    ERR_INTERNAL_SERVER_ERROR: 500
};

export async function buscarLocationPorId(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: El ID debe ser un número entero."
            });
        }

        const resultado = await db_buscarLocationPorId(id);

        if (resultado.length === 0) {
            return res.status(CODIGOS_HTTP.ERR_NOT_FOUND).json({
                error: "Error: No se encontró la ubicación (location)."
            });
        }

        return res.json(resultado);

    } catch (error) {
        console.error(error);

        res.status(CODIGOS_HTTP.ERR_INTERNAL_SERVER_ERROR).json({
            error: "Error: El servidor no pudo buscar la ubicación (location)."
        });
    }
}


export async function buscarLocationPorNombreJoin(req, res) {
    try {
        const name = req.params.name;

        if (!name || name.trim() === "") {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: El nombre no puede estar en blanco."
            });
        }

        const resultado = await db_buscarLocationPorNombreJoin(name);

        if (resultado.length === 0) {
            return res.status(CODIGOS_HTTP.ERR_NOT_FOUND).json({
                error: "Error: No se encontraron ubicaciones (locations)."
            });
        }

        return res.status(CODIGOS_HTTP.OK).json(resultado);

    } catch (error) {
        console.error(error);

        return res.status(CODIGOS_HTTP.ERR_INTERNAL_SERVER_ERROR).json({
            error: "Error: El servidor no pudo buscar las ubicaciones (location)."
        });
    }
}

/*
Ejemplo del JSON que debe contener req.body:
{
    "name": "Almacén Limón",
    "costRate": 10.5,
    "availability": 80.00
}
*/
export async function insertarLocation(req, res) {
    try {
        const { name, costRate, availability } = req.body;

        if (!name || name.trim() === "") {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: El nombre no puede estar en blanco."
            });
        }

        if (costRate === undefined || availability === undefined) {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: CostRate y Availability son obligatorios."
            });
        }

        const nuevoID = await db_insertarLocation(name, costRate, availability);

        return res.status(CODIGOS_HTTP.OK_CREATED).json({
            mensaje: "Ubicación insertada correctamente.",
            LocationID: nuevoID
        });

    } catch (error) {
        console.error(error);

        return res.status(CODIGOS_HTTP.ERR_INTERNAL_SERVER_ERROR).json({
            error: "Error: el servidor no pudo insertar la nueva ubicación (location)."
        });
    }
}

/*
Ejemplo del JSON que debe contener req.body:
{
    "name": "Almacén San José",
    "costRate": 7.0,
    "availability": 90.00
}
*/
export async function actualizarLocation(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: El ID debe ser un número entero."
            });
        }

        const { name, costRate, availability } = req.body;

        if (!name || name.trim() === "") {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: El nombre no puede estar en blanco."
            });
        }

        if (costRate === undefined || availability === undefined) {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: CostRate y Availability son obligatorios."
            });
        }

        const filasAfectadas = await db_actualizarLocation(id, name, costRate, availability);

        if (filasAfectadas === 0) {
            return res.status(CODIGOS_HTTP.ERR_NOT_FOUND).json({
                error: "Error: No se encontró la ubicación (location)."
            });
        }

        return res.status(CODIGOS_HTTP.OK).json({
            mensaje: `Se actualizaron ${filasAfectadas} fila(s).`
        });

    } catch (error) {
        console.error(error);

        return res.status(CODIGOS_HTTP.ERR_INTERNAL_SERVER_ERROR).json({
            error: "Error: El servidor no pudo buscar la ubicación (location)."
        });
    }
}


export async function eliminarLocation(req, res) {
    try {
        const id = Number(req.params.id);

        if (!Number.isInteger(id)) {
            return res.status(CODIGOS_HTTP.ERR_BAD_REQUEST).json({
                error: "Error: El ID debe ser un número entero."
            });
        }

        const filasAfectadas = await db_eliminarLocation(id);

        if (filasAfectadas === 0) {
            return res.status(CODIGOS_HTTP.ERR_NOT_FOUND).json({
                error: "Error: No se encontró la ubicación (location)."
            });
        }

        return res.status(CODIGOS_HTTP.OK).json({
            mensaje: `Se eliminaron ${filasAfectadas} fila(s).`
        });

    } catch (error) {
        console.error(error);

        return res.status(CODIGOS_HTTP.ERR_INTERNAL_SERVER_ERROR).json({
            error: "Error: El servidor no pudo buscar la ubicación (location)."
        });
    }
}
