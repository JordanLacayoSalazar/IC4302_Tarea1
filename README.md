# Tarea #1: API

### Estudiante: **Jordan Javier Lacayo Salazar**

### Carné: **2025092130**

### Estado de la tarea: **Excelente**

### Enlace del video:

---

<br>

## Introducción de la actividad

Para la realización de la tarea, se tomó la decisión de utilizar Ubuntu, el cual es una distribución de Linux; mediante WSL2 en Windows 11.

En el subsistema, se instalará Node.js junto con Microsoft SQL Server 2025, usando la base de datos de ejemplo AdventureWorks provista por Microsoft ([enlace de descarga de AdventureWorks2025](https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2025.bak)). También es necesario instalar npm (Node Package Manager) para poder descargar las librerías que necesita la API.

Para lograr crear una API RESTful con Node.js, se empleará el framework Express para atender las solicitudes HTTP y el controlador mssql para comunicarse con SQL Server.

Las operaciones de la API que se creará se realizarán mediante procedimientos almacenados (Stored Procedures) en SQL Server. Node.js será el encargado de ejecutar la API, recibiendo y procesando las solicitudes. De esta manera, la API permitirá realizar las operaciones Create, Read, Update y Delete mediante los métodos POST, GET, PUT y DELETE, respectivamente.

Esta documentación contiene los pasos que hice para llevar a cabo esta tarea.
<br><br>


## Instalación de los requerimientos paso a paso
**1. Instalar Windows Subsystem for Linux 2.** En mi caso, ya se encontraba instalado y configurado en el sistema.

**2. Instalar la distribución Ubuntu.** Para ello, se ejecutó el siguiente comando en PowerShell:
```pwsh
wsl --install -d Ubuntu-24.04
```

Esto comando usa la herramienta de WSL instalar la distribución Ubuntu-24.04. La bandera `-d` indica que lo que se desea instalar es una distribución de Linux.  
Debe ser específicamente esta versión porque esta es una de las versiones de Linux compatibles y soportadas oficialmente por SQL Server 2025.
<br><br>

**3. Iniciar Ubuntu y crear usuario.**  
Al iniciar Ubuntu por primera vez, se muestra un mensaje de que el sistema realiza su configuración inicial y solicita crear una cuenta de usuario UNIX que será usada dentro del entorno Linux: 
```
Provisioning the new WSL instance Ubuntu-24.04
This might take a while...
Create a default Unix user account:
```

Se ingresa el nombre del nuevo usuario. Luego, se solicita establecer una contraseña para dicho usuario y confirmarla.

Seguidamente, se debe verificar que Ubuntu se está ejecutando mediante WSL2. Así que, en PowerShell, se ejecutó el siguiente comando:
```pwsh
wsl --list --verbose
```
Se obtuvo la salida:
```
  NAME              STATE           VERSION
  Ubuntu-24.04      Running         2
```
La columna VERSION contiene el número 2, confirmando que Ubuntu sí se ejecuta sobre WSL2.
<br><br>

**4. Actualizar paquetes de Ubuntu.** Para descargar desde los repositorios la información más reciente sobre los paquetes disponibles, se ejecuta en Ubuntu:
```bash
sudo apt update
```
Esto no instala ni actualiza programas. Solo actualiza la lista de versiones que el sistema conoce.  
La salida que obtuve fue:
```
186 packages can be upgraded. Run 'apt list --upgradable' to see them.
```
Una vez que el sistema sabe las versiones más recientes, se procede a actualizar los paquetes instalados en el sistema con el comando:
```bash
sudo apt upgrade -y
```
La opción `-y` responde automáticamente "sí" a todas las preguntas de confirmación de instalación de paquetes, permitiendo que el proceso continúe sin intervención del usuario.  
Hecho todo esto, Ubuntu está listo para usar.
<br><br>


## Instalación de los programas

### SQL Server 2025
Según la [ documentación oficial de Microsoft](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-ubuntu?view=sql-server-linux-ver17&tabs=ubuntu2004%2C2025ubuntu2204%2Codbc-ubuntu-1804), se deben ejecutar los siguientes comandos:

**1.** Ubuntu necesita asegurarse de que los archivos de SQL Server que se descargarán realmente provienen de Microsoft. Por lo tanto, se necesita descargar la clave pública de Microsoft y guardarla con el fin de que, en el futuro, la herramienta `apt` pueda verificar los paquetes que se descargarán:
```bash
curl -fsSL https://packages.microsoft.com/keys/microsoft.asc | sudo gpg --dearmor -o /usr/share/keyrings/microsoft-prod.gpg
```
*(No produce ninguna salida).*
<br><br>

**2.** Para que Ubuntu sepa de dónde descargar los paquetes de SQL Server, se requiere agregar el repositorio oficial de Microsoft del SQL Server 2025 para Ubuntu 24.04:
```bash
curl -fsSL https://packages.microsoft.com/config/ubuntu/24.04/mssql-server-2025.list | sudo tee /etc/apt/sources.list.d/mssql-server-2025.list
```
Se produce la siguiente salida:
```
deb [arch=amd64,arm64,armhf signed-by=/usr/share/keyrings/microsoft-prod.gpg] https://packages.microsoft.com/ubuntu/24.04/mssql-server-2025 noble main
```
Esto indica que el repositorio quedó configurado y que APT usará la clave pública agregada anteriormente para la verificación de los paquetes.
<br><br>

**3.** Ya que se ha agregado el repositorio oficial de SQL Server 2025, se debe actualizar la información de los repositorios configurados y obtener nueva información sobre los paquetes:
```bash
sudo apt update
```
Con este comando, Ubuntu indicó que había algunos paquetes del sistema con versiones más recientes disponibles, así que nuevamente se actualizan los paquetes del sistema:
```bash
sudo apt upgrade -y
```

**4.** Ya teniendo la lista de repositorios actualizada, se procede a instalar el motor de SQL Server 2025:
```bash
sudo apt install -y mssql-server
```
Al final de la salida se imprimió lo siguiente:
```
+--------------------------------------------------------------+
Please run 'sudo /opt/mssql/bin/mssql-conf setup'
to complete the setup of Microsoft SQL Server
+--------------------------------------------------------------+
```
Está solicitando que se debe ejecutar ese comando de configuración inicial para terminar de instalar correctamente SQL Server. Para ver la continuación del procedimiento para la configuración, vaya a la sección **Configuración de Servicios: SQL Server 2025, sección 1.**
<br><br>

---
### Node.js y npm
Se deben ingresar los siguentes comandos:

**1.**  Ejecutar la instalación:
```bash
sudo apt install -y nodejs npm
```
<br>

**2.** Verificar que han sido instalados:
```bash
node --version
npm --version
```
Si se muestran sus números de versión, significa que fueron instalados exitosamente.
<br><br>

**3. Instalar Express y mssql:**

**3.1.** Crear la base de archivos Node.js:

En primer lugar, se crea un directorio para los archivos de Node.js y luego se entra en ese directorio. En mi caso, se llamará Codigo:
```bash
mkdir -p tarea1/Codigo
cd tarea1/Codigo
```
Posteriormente, se crea el proyecto Node.js con el comando:
```bash
npm init
```
La base de archivos incluye uno llamado package.json. Este archivo contiene información básica del proyecto y después va a almacenar las dependencias y configuraciones utilizadas por la API.

Durante la configuración, npm solicita diferentes datos:
```
package name: (tarea1) ic4302_tarea1
version: (1.0.0)
description: API para comunicarse con una base de datos en SQL Server
entry point: (index.js)
test command:
git repository:
keywords:
author: Jordan Javier Lacayo Salazar
license: (ISC)
```

- package name: Define el nombre del proyecto.
- version: Indica la versión inicial de dicho proyecto.
- description: Contiene una descripción breve del propósito del proyecto.
- entry point: Indica cuál será el archivo principal desde el que se ejecutará la aplicación. Se mantuvo el valor predeterminado index.js.
- test command: Permite ingresar un comando para ejecutar pruebas automatizadas del proyecto. En este caso, se dejó vacío porque no se usarán.
- git repository: Permite indicar la dirección del repositorio de Git donde se almacenará el proyecto. Se dejó vacío porque todos los archivos de esta tarea (SQL, JavaScript y README) se subirán después al repositorio de GitHub.
- keywords: Permite agregar palabras clave relacionadas con el proyecto para facilitar su identificación dentro del ecosistema de npm. Para fines de esta tarea, no son necesarias.
- author: Indica el autor del proyecto.
- license: Indica la licencia bajo la cual se distribuye el proyecto. Se mantuvo la opción predeterminada ISC.
<br><br>

**3.2.** Instalar el framework Express:  
Sin salir del directorio `tarea1`, se ejecuta:
```bash
npm install express
```
**3.3.** Instalar el controlador `mssql`:
```bash
npm install mssql
```
Durante la instalación se mostraron varias advertencias, por ejemplo:
```
npm WARN EBADENGINE Unsupported engine {
npm WARN EBADENGINE   package: 'tedious@20.0.0',
npm WARN EBADENGINE   required: { node: '>=22' },
npm WARN EBADENGINE   current: { node: 'v18.19.1', npm: '9.2.0' }
```
Las advertencias señalan que algunas de las dependencias utilizadas por la versión de mssql que se estaba instalando requieren la versión 22 o mayor de Node.js. Anteriormente, la versión que se instaló fue la v18.19.1.

A pesar de esto, la instalación terminó correctamente, pero es mejor actualizar Node.js con la herramienta `nvm` (Node Version Manager) para evitar dificultades en el futuro. 
<br><br>

**3.4.** Instalar `nvm`:  
Para descargar la última versión hasta la fecha de esta documentación (v0.40.7), se debe ejecutar lo siguiente:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.7/install.sh | bash
```
Aplicar el cambio inmediatamente en la terminal actual:
```bash
source ~/.bashrc
```

Verificar la herramienta `nvm` con el comando:
```bash
nvm --version
```
Si muestra el número de versión, se instaló de forma exitosa.
<br><br><br>

**3.5.** Actualizar Node.js:
```bash
nvm install 22
```
Estas fueron las últimas 2 líneas de la salida:
```
Now using node v22.23.2 (npm v10.9.8)
Creating default alias: default -> 22 (-> v22.23.2 *)
```
Al ejecutar este comando, se descargó e instaló la versión 22.23.2 de Node.js junto con npm 10.9.8. Esta nueva versión de Node.js quedó activa y configurada como la versión predeterminada que usará Ubuntu.
<br><br><br>

**3.6.** Verificar dependencias  
Ahora se debe validar que los paquetes recién instalados no tengan errores y advertencias, especialmente `mssql`, con el comando:
```bash
npm install 
```
Esto revisa el proyecto y comprueba que las dependencias definidas en package.json fueran compatibles y que estuvieran instaladas con el entorno actual de Node.js.  
La salida ya no presenta errores ni advertencias.
<br><br><br>

**3.7.** Instalar `dotenv`:  
Por motivos de seguridad, las credenciales utilizadas para conectarse a SQL Server no deben escribirse directamente en el código fuente, ya que el proyecto será almacenado en GitHub.

Para evitar exponer información sensible, se utilizará un archivo .env, donde se almacenarán las credenciales y otros datos necesarios para establecer la conexión con SQL Server.

Para que la aplicación pueda cargar las variables almacenadas en el archivo .env, se debe instalar la dependencia `dotenv` con el comando:
```bash
npm install dotenv
```
Para ver la continuación del procedimiento de la creación y uso del archivo .env, vaya a la sección **Configuración de Servicios: SQL Server 2025, sección 5.**
<br><br><br>


## Configuración de los servicios

### SQL Server 2025
Con base en la [ documentación oficial de Microsoft](https://learn.microsoft.com/en-us/sql/linux/install-upgrade/quickstart-install-ubuntu?view=sql-server-linux-ver17&tabs=ubuntu2004%2C2025ubuntu2204%2Codbc-ubuntu-1804), se deben ejecutar los siguientes comandos:

**1.** Empezar la configuración:
```bash
sudo /opt/mssql/bin/mssql-conf setup
```
**1.1.** Se pide elegir una edición del software:
```
Choose an edition of SQL Server:
  1) Evaluation (free, no production use rights, 180-day limit)
  2) Enterprise Developer (free, no production use rights)
  3) Standard Developer (free, no production use rights)
  4) Express (free)
  5) Standard (PAID)
  6) Enterprise (PAID) - CPU core utilization restricted to 20 physical/40 hyperthreaded
  7) Enterprise Core (PAID) - CPU core utilization up to Operating System Maximum
  8) I bought a license through a retail sales channel and have a product key to enter.
  9) Standard (Billed through Azure) - Use pay-as-you-go billing through Azure.
  10) Enterprise Core (Billed through Azure) - Use pay-as-you-go billing through Azure.
```
Se seleccionó la opción 4: la edición Express, debido a que es gratuita y brinda las funcionalidades necesarias para esta tarea.
<br><br><br>

**1.2.** Se mostró información de los términos de licencia y la declaración de privacidad. Para continuar con la instalación, se aceptaron las condiciones ingresando `Yes`.
<br><br><br>

**1.3.** Se debe crear una contraseña para el usuario administrador `sa`:
```
Enter the SQL Server system administrator password:
```
Esta contraseña será necesaria para conectarse al sistema de bases de datos.
<br><br><br>

**1.4.** Una vez ingresada y confirmada la contraseña, la última línea de la salida generada indica que la configuración se completó correctamente y el servicio de SQL Server ya inició a ejecutarse:
```
Setup has completed successfully. SQL Server is now starting.
```
<br>

**1.5.** Se verifica que el servicio esté en funcionamiento:
```bash
systemctl status mssql-server --no-pager
```
Efectivamente, sí está funcionando:
```
Active: active (running) since Mon 2026-09-14 08:34:48 CST; 4min 59s ago
```
<br><br>


**2.** Instalar las herramientas de línea de comandos  
Para crear una base de datos, se necesitan las herramientas `sqlcmd` y `bcp` para que sea posible ejecutar instrucciones Transact-SQL en SQL Server.
<br><br>

**2.1.** Descargar el paquete de configuración del repositorio de Microsoft.  
Este configura en Ubuntu la fuente desde donde se pueden obtener paquetes de productos de Microsoft, entre ellos las herramientas `sqlcmd` y `bcp`:
```bash
curl -sSL -O https://packages.microsoft.com/config/ubuntu/24.04/packages-microsoft-prod.deb
```
*(No produce ninguna salida).*
<br><br><br>

**2.2.** Instalar el paquete de configuración:
```bash
sudo dpkg -i packages-microsoft-prod.deb
```
Esto agrega la configuración del repositorio de paquetes de Microsoft en Ubuntu.
<br><br><br>

**2.3.** Actualizar nuevamente la información de los repositorios disponibles para que se reconozcan los paquetes de Microsoft que se pueden instalar:
```bash
sudo apt update
```
<br>

**2.4.** Instalar las herramientas de línea de comandos y también las bibliotecas necesarias para trabajar con ODBC:
```bash
sudo apt install mssql-tools18 unixodbc-dev
```
- **mssql-tools18**: contiene las herramientas de línea de comandos para SQL Server. Entre ellos están `sqlcmd` y `bcp`.
- **unixodbc-dev**: instala los archivos de desarrollo necesarios para que aplicaciones y bibliotecas que utilizan ODBC puedan comunicarse con sistemas de bases de datos compatibles.

Cuando se ejecuta este comando, se muestra la siguiente interfaz en la terminal de Ubuntu:

<img width="1330" height="663" alt="Captura de pantalla 2026-09-14 103247" src="https://github.com/user-attachments/assets/c6420653-88fe-4400-ba69-cc7573f2a3cd" />

Significa que se está configurando el controlador ODBC 18 de Microsoft para SQL Server y se solicita aceptar los términos de licencia. Se selecciona `<Yes>`.

Seguidamente, se muestra otra interfaz solicitando aceptar los términos de licencia de `mssql-tools18`. Deben aceptarse para continuar con la instalación.

<img width="1327" height="672" alt="Captura de pantalla 2026-09-14 104022" src="https://github.com/user-attachments/assets/cfb0c850-f31d-4ce3-a2b4-6faeee9da566" />

Después de esto, termina la instalación.
<br><br><br>

**2.5.** Agregar las herramientas de SQL Server al PATH:  
Se ejecutan los siguientes comandos:

Agregar las herramientas al PATH:
```bash
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc
```

Aplicar el cambio inmediatamente en la terminal actual:
```bash
source ~/.bashrc
```
*(Ambos comandos no producen ninguna salida).*

Se verifican las herramientas `sqlcmd` y `bcp` con los comandos:
```bash
sqlcmd -?
```
Debe imprimir la ayuda de sus opciones/acciones.

```bash
bcp -v
```
Debe mostrar su número de versión.


---
<br><br>
**3.** Restaurar la base de datos AdventureWorks2025:

**3.1.** Crear carpeta de backups dentro del directorio de SQL Server
```bash
sudo mkdir -p /var/opt/mssql/backup
```
*(No produce ninguna salida).*  
Se debe crear este directorio específico para que el motor de bases de datos tenga acceso al archivo.
<br><br>

**3.2.** Obtener el backup en Ubuntu:  
Primeramente, se descarga el respaldo de la base de datos desde este [enlace](https://github.com/Microsoft/sql-server-samples/releases/download/adventureworks/AdventureWorks2025.bak) en Windows 11 para luego copiarlo a Ubuntu.  
La descarga, por defecto, queda ubicada en la carpeta Downloads.

Seguidamente, se realiza el siguiente comando:
```bash
sudo cp /mnt/c/Users/NOMBRE_USUARIO/Downloads/AdventureWorks2025.bak /var/opt/mssql/backup/
```
*(No produce ninguna salida).*   
Se debe sustituir `NOMBRE_USUARIO` por el nombre real del usuario en Windows.
<br><br><br>

**3.3** Conectarse al SQL Server:  
Se procede a entrar al motor para poder restaurar la base de datos. Se ejecuta el comando:
```bash
sqlcmd -S localhost -U sa -C
```
- `-S`: Especifica el servidor (Server) al que se desea conectar.
- `-U`: Indica el usuario (User) con el que se va a iniciar sesión.
- `-C`: Señala que confíe ciegamente en el certificado de seguridad del servidor, es decir, que confíe en que el servidor es seguro.

Al ejecutarlo, se solicitará la contraseña que se creó anteriormente para `sa`, y una vez ingresada correctamente, se conectará de forma exitosa.
<br><br>

**3.4.** Restaurar el backup mediante comandos SQL:  
Al utilizar `sqlcmd` desde la terminal, se mostrarán indicadores como `1>`, `2>`, `3>`, etc. Estos números son mostrados automáticamente para indicar el número de línea actual.  
Se debe ejecutar lo siguiente:
```sql
1> RESTORE DATABASE AdventureWorks
2> FROM DISK = '/var/opt/mssql/backup/AdventureWorks2025.bak'
3> WITH
4> MOVE 'AdventureWorks' TO '/var/opt/mssql/data/AdventureWorks.mdf',
5> MOVE 'AdventureWorks_log' TO '/var/opt/mssql/data/AdventureWorks_log.ldf';
6> GO
```
- Línea 1: Indica que se desea restaurar una base de datos llamada AdventureWorks.
- Línea 2: La restauración usará el archivo de respaldo .bak ubicado en `/var/opt/mssql/backup/`.
- Línea 3: Señala que a continuación se especifican unas instrucciones de cómo realizar la restauración.
- Línea 4: `AdventureWorks` es el nombre lógico del archivo de datos dentro del respaldo, y `/var/opt/mssql/data/AdventureWorks.mdf` es la ubicación y nombre que tendrá el archivo .mdf dentro de Ubuntu.
- Línea 5: `AdventureWorks_log` es el nombre lógico del archivo de registro y `/var/opt/mssql/data/AdventureWorks_log.ldf` es la ubicación y nombre del archivo .ldf dentro de Ubuntu.
- Línea 6: Termina este bloque de instrucciones y lo ejecuta.


Se mostró la siguiente salida, manifestando que se restauró exitosamente:
```
Processed 25512 pages for database 'AdventureWorks', file 'AdventureWorks' on file 1.
Processed 2 pages for database 'AdventureWorks', file 'AdventureWorks_log' on file 1.
RESTORE DATABASE successfully processed 25514 pages in 3.759 seconds (53.025 MB/sec).
```
Para salir de `sqlcmd`, ingrese `exit` o `quit`.
<br><br><br>

**4.** Registrar los Stored Procedures en AdventureWorks2025:  
El archivo que contiene los procedimientos almacenados los creé de antemano para luego hacer lo siguiente:

 Primero, ubicarse dentro del directorio creado para el script SQL:
```bash
cd tarea1/"Script sql"
```

Cargar los Stored Procedures a SQL Server:
```bash
sqlcmd -S localhost -U sa -C -i sp_ProductionLocation.sql
```
- `-i`: Significa input. Indica la ruta y/o el archivo .sql que SQL Server ejecutará automáticamente. En este caso, mi script se llama `sp_ProductionLocation.sql`.

Se solicita la contraseña creada con anterioridad para `sa`. Una vez ingresada correctamente, se ejecuta el script y los procedimientos almacenados quedan guardados dentro de la base de datos.  
La salida generada muestra que todos los procedimientos que han sido guardados:
```
Changed database context to 'AdventureWorks'.
  CREATE_PROCEDURE - dbo.sp_ProductionLocation_buscarPorId
  CREATE_PROCEDURE - dbo.sp_ProductionLocation_ProductionProductInventory_ProductionProduct_buscarPorNombre
  CREATE_PROCEDURE - dbo.sp_ProductionLocation_insertar
  CREATE_PROCEDURE - dbo.sp_ProductionLocation_actualizar
  CREATE_PROCEDURE - dbo.sp_ProductionLocation_eliminar
```
<br>

**5.** Crear y usar el archivo .env para acceder a SQL Server:  
En la raíz del directorio donde se encuentran los ficheros JavaScript (en mi caso, la carpeta Codigo que fue creada previamente), se creó con anterioridad el archivo .env. Dentro del archivo, se colocaron las siguientes variables:
```
MSSQL_SERVER=localhost
MSSQL_DATABASE=AdventureWorks
MSSQL_USER=sa
MSSQL_PASSWORD=CONTRASEÑA
MSSQL_PORT=1433
```
Se debe reemplazar `CONTRASEÑA` por la contraseña real.

Dado que el archivo .env no debe subirse al repositorio de GitHub, se agrega el archivo .gitignore.

Para usar las variables definidas, se emplea `dotenv.config()` en el archivo `mssql_config.js`. Este método permite acceder al archivo .env, leerlo y cargar sus variables dentro de `process.env` de Node.js. Seguidamente, se crea el objeto `config` con las credenciales cargadas:
```js
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
```
Finalmente, mediante `sql.connect(config)`, se usan los parámetros de conexión definidos en config, incluyendo las credenciales, para preparar la conexión con SQL Server.
<br><br><br>

### Servidor Express (código JavaScript)
**1.** Configuración de rutas:  
El framework Express se encarga de definir las rutas que, mediante estas, va a recibir las solicitudes HTTP y decidir qué hacer con ellas.

Para lograrlo, en el archivo `server.js`, se creó una función llamada `configurarRutas(app)`, la cual es responsable de registrar las rutas de los servicios y asociarlas con sus respectivas funciones (controladores). De esta manera, se mantiene separada la lógica que procesa las solicitudes.

Se definieron las siguientes rutas:
| Método HTTP | Ruta | Función |
|---|---|---|
| GET | `/api/location/id/:id` | Busca una ubicación usando su identificador. |
| GET | `/api/location/name/:name` | Busca ubicaciones por nombre mediante una consulta con JOIN. |
| POST | `/api/location` | Inserta una nueva ubicación. |
| PUT | `/api/location/id/:id` | Actualiza una ubicación usando su identificador. |
| DELETE | `/api/location/id/:id` | Elimina una ubicación usando su identificador. |
| GET | `/api/salud` | Ruta adicional. Verifica que la aplicación pueda recibir solicitudes. |

Los parámetros `:id` y `:name` representan variables que forman parte de la URL, y los controladores las obtienen mediante `req.params`.

Una vez configuradas las rutas, se crea la instancia de Express con `express()`. Luego, se configura `express.json()` para permitir que la aplicación reciba y procese solicitudes en formato JSON. Finalmente, se llama a la función `configurarRutas(app)` y se exporta la instancia para encender el servidor desde el archivo principal de la aplicación (`index.js`).
<br><br><br>

**2.** Error al importar módulos:  
Al intentar ejecutar index.js por primera vez, se lanzó la siguiente advertencia:
```
(node:2003) [MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///home/jortec/tarea1/Codigo/index.js is not specified and it doesn't parse as CommonJS.
Reparsing as ES module because module syntax was detected. This incurs a performance overhead.
To eliminate this warning, add "type": "module" to /home/jortec/tarea1/Codigo/package.json.
(Use `node --trace-warnings ...` to show where the warning was created)
```
Este aviso ocurre porque Node.js por defecto intenta leer el código como CommonJS, pero `index.js` usa la sintaxis moderna de ES Modules (import/export). Node.js advierte que debe procesar el archivo dos veces, afectando el rendimiento.

Para solucionarlo, se debe especificar "type": "module" en el archivo package.json, quedando de la siguiente manera:
```json
{
  "name": "ic4302_tarea1",
  "version": "1.0.0",
  "description": "API para comunicarse con una base de datos en SQL Server",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "author": "Jordan Javier Lacayo Salazar",
  "license": "ISC",
  "dependencies": {
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "mssql": "^12.7.2"
  },
  "type": "module"
}
```
<br>


## Datos de prueba

### Buscar una ubicación por ID  
Se utiliza el método GET en la siguiente ruta de ejemplo:
- http://localhost:3000/api/location/id/1

El valor 1 corresponde al LocationID de la ubicación que se desea consultar.
<br><br>

### Buscar una ubicación por nombre
Se utiliza el método GET en la siguiente ruta de ejemplo:
- http://localhost:3000/api/location/name/Almacén

El valor Almacén corresponde al texto utilizado para buscar coincidencias en el nombre de la ubicación.
<br><br>

### Insertar una nueva ubicación  
Se utiliza el método POST en la siguiente ruta:
- http://localhost:3000/api/location/

En el cuerpo de la solicitud se envían los datos en formato JSON. Ejemplo:
```json
{
    "name": "Almacén Guápiles",
    "costRate": 10.50,
    "availability": 95.00
}
```
<br>

### Actualizar una ubicación
Se utiliza el método PUT en la siguiente ruta de ejemplo:
- http://localhost:3000/api/location/id/1

El LocationID indicado en la URL determina el registro que será modificado.  
Los nuevos valores se envían en formato JSON. Ejemplo:
```json
{
    "name": "Almacén Limón Centro",
    "costRate": 12.50,
    "availability": 90.00
}
```
<br>

### Eliminar una ubicación
Se utiliza el método DELETE en la siguiente ruta de ejemplo:
- http://localhost:3000/api/location/id/1

El LocationID indicado en la URL determina el registro que será eliminado.
