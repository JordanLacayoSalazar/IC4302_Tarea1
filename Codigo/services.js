import { sql, poolPromise } from "./mssql_config.js";

export async function db_buscarLocationPorId(id) {
    const pool = await poolPromise; // Obtiene el pool de conexiones con SQL Server.
    const resultado = await pool
        .request() //Preparar solicitud a la base de datos usando el pool de conexiones
        .input("LocationID", sql.SmallInt, id) //input(nombre, tipoSQL, valor)
        .execute("dbo.sp_ProductionLocation_buscarPorId");

    return resultado.recordset; //recordset devuelve las filas obtenidas como un arreglo de objetos JavaScript
}

export async function db_buscarLocationPorNombreJoin(name) {
    const pool = await poolPromise;
    const resultado = await pool
        .request()
        .input("Name", sql.NVarChar, name)
        .execute("dbo.sp_ProductionLocation_ProductionProductInventory_ProductionProduct_buscarPorNombre");

    return resultado.recordset;
}

export async function db_insertarLocation(name, costRate, availability) {
    const pool = await poolPromise;
    const resultado = await pool
        .request()
        .input("Name", sql.NVarChar, name)
        .input("CostRate", sql.SmallMoney, costRate)
        .input("Availability", sql.Decimal, availability)
        .execute("dbo.sp_ProductionLocation_insertar");

    return resultado.recordset[0].LocationID; // Devuelve directamente el número del nuevo ID
}

export async function db_actualizarLocation(id, name, costRate, availability) {
    const pool = await poolPromise;
    const resultado = await pool
        .request()
        .input("LocationID", sql.SmallInt, id)
        .input("Name", sql.NVarChar, name)
        .input("CostRate", sql.SmallMoney, costRate)
        .input("Availability", sql.Decimal, availability)
        .execute("dbo.sp_ProductionLocation_actualizar");

    // rowsAffected es un arreglo con la cantidad de filas afectadas por cada operación.
    // Como solo se hace una operación, se devuelve el primer elemento
    return resultado.rowsAffected[0];
}

export async function db_eliminarLocation(id) {
    const pool = await poolPromise;
    const resultado = await pool
        .request()
        .input("LocationID", sql.SmallInt, id)
        .execute("dbo.sp_ProductionLocation_eliminar");

    return resultado.rowsAffected[0];
}
