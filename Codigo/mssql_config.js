import sql from "mssql";
import dotenv from "dotenv";

dotenv.config(); //Carga variables del .env dentro de process.env

const config = {
    server: process.env.MSSQL_SERVER,
    database: process.env.MSSQL_DATABASE,
    user: process.env.MSSQL_USER,
    password: process.env.MSSQL_PASSWORD,
    port: parseInt(process.env.MSSQL_PORT),
    options: {
        encrypt: true,
        trustServerCertificate: true
    }
};

/*
Prepara la conexión a la base de datos y guarda la Promise del pool de conexiones.
(conjunto de conexiones disponibles a la base de datos que se pueden reutilizar)
*/
const poolPromise = sql.connect(config);

export { sql, poolPromise };
