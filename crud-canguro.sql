USE [master]
GO
/****** Object:  Database [crud]    Script Date: 14/08/2024 10:40:38 p. m. ******/
CREATE DATABASE [crud]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'crud', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\crud.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'crud_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\crud_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [crud] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [crud].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [crud] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [crud] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [crud] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [crud] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [crud] SET ARITHABORT OFF 
GO
ALTER DATABASE [crud] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [crud] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [crud] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [crud] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [crud] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [crud] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [crud] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [crud] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [crud] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [crud] SET  DISABLE_BROKER 
GO
ALTER DATABASE [crud] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [crud] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [crud] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [crud] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [crud] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [crud] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [crud] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [crud] SET RECOVERY FULL 
GO
ALTER DATABASE [crud] SET  MULTI_USER 
GO
ALTER DATABASE [crud] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [crud] SET DB_CHAINING OFF 
GO
ALTER DATABASE [crud] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [crud] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [crud] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [crud] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'crud', N'ON'
GO
ALTER DATABASE [crud] SET QUERY_STORE = ON
GO
ALTER DATABASE [crud] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [crud]
GO
/****** Object:  Table [dbo].[Monedas]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Monedas](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [nvarchar](100) NOT NULL,
	[Codigo] [nvarchar](10) NOT NULL,
	[Simbolo] [nvarchar](10) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Registros]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Registros](
	[Codigo] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [nvarchar](250) NOT NULL,
	[Direccion] [nvarchar](250) NOT NULL,
	[Identificacion] [nvarchar](50) NOT NULL,
	[FechaCreacion] [datetime] NULL,
	[MonedaId] [int] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Codigo] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
ALTER TABLE [dbo].[Registros] ADD  DEFAULT (getdate()) FOR [FechaCreacion]
GO
ALTER TABLE [dbo].[Registros]  WITH CHECK ADD FOREIGN KEY([MonedaId])
REFERENCES [dbo].[Monedas] ([Id])
GO
/****** Object:  StoredProcedure [dbo].[spAgregarMoneda]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para agregar una nueva moneda
CREATE PROCEDURE [dbo].[spAgregarMoneda]
    @Nombre NVARCHAR(100),
    @Codigo NVARCHAR(10),
    @Simbolo NVARCHAR(10)
AS
BEGIN
    INSERT INTO Monedas (Nombre, Codigo, Simbolo)
    VALUES (@Nombre, @Codigo, @Simbolo);
END;
GO
/****** Object:  StoredProcedure [dbo].[spEditarMoneda]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para editar una moneda existente
CREATE PROCEDURE [dbo].[spEditarMoneda]
    @Id INT,
    @Nombre NVARCHAR(100),
    @Codigo NVARCHAR(10),
    @Simbolo NVARCHAR(10)
AS
BEGIN
    UPDATE Monedas
    SET Nombre = @Nombre,
        Codigo = @Codigo,
        Simbolo = @Simbolo
    WHERE Id = @Id;
END;
GO
/****** Object:  StoredProcedure [dbo].[spEditarRegistro]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spEditarRegistro]
    @Codigo INT,
    @Descripcion NVARCHAR(250),
    @Direccion NVARCHAR(250),
    @Identificacion NVARCHAR(50),
    @MonedaId INT
AS
BEGIN
    UPDATE Registros
    SET Descripcion = @Descripcion,
        Direccion = @Direccion,
        Identificacion = @Identificacion,
        MonedaId = @MonedaId
    WHERE Codigo = @Codigo;
END;
GO
/****** Object:  StoredProcedure [dbo].[spEliminarMoneda]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para eliminar una moneda por ID
CREATE PROCEDURE [dbo].[spEliminarMoneda]
    @Id INT
AS
BEGIN
    DELETE FROM Monedas
    WHERE Id = @Id;
END;
GO
/****** Object:  StoredProcedure [dbo].[spEliminarRegistro]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spEliminarRegistro]
    @Codigo INT
AS
BEGIN
    DELETE FROM Registros
    WHERE Codigo = @Codigo;
END;
GO
/****** Object:  StoredProcedure [dbo].[spGuardarRegistro]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE [dbo].[spGuardarRegistro]
    @Descripcion NVARCHAR(250),
    @Direccion NVARCHAR(250),
    @Identificacion NVARCHAR(50),
    @MonedaId INT
AS
BEGIN
    INSERT INTO Registros (Descripcion, Direccion, Identificacion, MonedaId)
    VALUES (@Descripcion, @Direccion, @Identificacion, @MonedaId);
END;
GO
/****** Object:  StoredProcedure [dbo].[spLeerRegistros]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[spLeerRegistros]
AS
BEGIN
    SELECT 
        r.Codigo,
        r.Descripcion,
        r.Direccion,
        r.Identificacion,
        r.FechaCreacion,
        r.MonedaId,
        m.Nombre AS MonedaNombre,
		m.Codigo AS MonedaCodigo
    FROM 
        Registros r
    INNER JOIN 
        Monedas m ON r.MonedaId = m.Id;
END;
GO
/****** Object:  StoredProcedure [dbo].[spObtenerMonedas]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para obtener todas las monedas
CREATE PROCEDURE [dbo].[spObtenerMonedas]
AS
BEGIN
    SELECT 
        Id,
        Nombre,
        Codigo,
        Simbolo
    FROM 
        Monedas;
END;
GO
/****** Object:  StoredProcedure [dbo].[spValidarIdentificacion]    Script Date: 14/08/2024 10:40:38 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- Procedimiento para validar la identificación del usuario
CREATE PROCEDURE [dbo].[spValidarIdentificacion]
    @Identificacion NVARCHAR(50)
AS
BEGIN
    SELECT 
        r.Codigo,
        r.Descripcion,
        r.Direccion,
        r.Identificacion,
        r.FechaCreacion,
        r.MonedaId,
        m.Nombre AS MonedaNombre,
        m.Codigo AS MonedaCodigo
    FROM 
        Registros r
    LEFT JOIN 
        Monedas m ON r.MonedaId = m.Id
    WHERE 
        r.Identificacion = @Identificacion;
END;
GO
USE [master]
GO
ALTER DATABASE [crud] SET  READ_WRITE 
GO
