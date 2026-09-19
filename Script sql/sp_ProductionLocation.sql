USE AdventureWorks;
GO

-- Usada por la función buscarLocationPorId, mediante la dirección GET /api/location/id/:id
CREATE OR ALTER PROCEDURE dbo.sp_ProductionLocation_buscarPorId
    @LocationID SMALLINT
as
BEGIN
    SET NOCOUNT ON;

    SELECT *
    FROM Production.Location
    WHERE LocationID = @LocationID;
END;
GO


-- Usada por la función buscarLocationPorNombreJoin, mediante la dirección GET /api/location/nombre/:name
CREATE OR ALTER PROCEDURE dbo.sp_ProductionLocation_ProductionProductInventory_ProductionProduct_buscarPorNombre
    @Name NVARCHAR(50)
as
BEGIN
    SET NOCOUNT ON;

    SELECT
        l.LocationID,
        l.Name as LocationName,
        pi.ProductID,
        p.Name as ProductName,
        pi.Quantity as ProductQuantityInventory,
        l.CostRate as CostRateLocation,
        l.Availability as AvailabilityLocation,
        pi.Shelf as ShelfInventory,
        pi.Bin as BinInventory
    FROM Production.Location l
    INNER JOIN Production.ProductInventory pi
        ON l.LocationID = pi.LocationID
    INNER JOIN Production.Product p
        ON pi.ProductID = p.ProductID
    WHERE l.Name LIKE '%' + @Name + '%'
    ORDER BY l.LocationID, pi.ProductID;
END;
GO


-- Usada por la función insertarLocation, mediante la dirección POST /api/location
CREATE OR ALTER PROCEDURE dbo.sp_ProductionLocation_insertar
    @Name NVARCHAR(50),
    @CostRate SMALLMONEY,
    @Availability DECIMAL(8,2)
as
BEGIN
    SET NOCOUNT ON;

    INSERT INTO Production.Location (Name, CostRate, Availability)
    VALUES (@Name, @CostRate, @Availability);

    SELECT SCOPE_IDENTITY() AS LocationID; -- Devuelve el último ID generado
END;
GO


-- Usada por la función actualizarLocation, mediante la dirección PUT /api/location/id/:id
CREATE OR ALTER PROCEDURE dbo.sp_ProductionLocation_actualizar
    @LocationID SMALLINT,
    @Name NVARCHAR(50),
    @CostRate SMALLMONEY,
    @Availability DECIMAL(8,2)
as
BEGIN
    UPDATE Production.Location
    SET
        Name = @Name,
        CostRate = @CostRate,
        Availability = @Availability,
        ModifiedDate = GETDATE()
    WHERE LocationID = @LocationID;
END;
GO


-- Usada por la función eliminarLocation, mediante la dirección DELETE /api/location/id/:id
CREATE OR ALTER PROCEDURE dbo.sp_ProductionLocation_eliminar
    @LocationID SMALLINT
as
BEGIN
    DELETE FROM Production.Location
    WHERE LocationID = @LocationID;
END;
GO
