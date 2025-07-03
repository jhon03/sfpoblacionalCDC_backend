# sfpoblacionalCDC_backend
Análisis de la implementación de un software para caracterización poblacional en el CDC: proyecto de grado para optar titulo de Ingeniero de sistemas de la USBCALI

#1 cargar dependencias de npm
- npm i o npm install

#2 crear Variables de Entorno
- crear archivo .env y colocar las mismas variables que estan en el archivo .env.copia con sus respectivos valores

#3 correr el proyecto
- npm start o npm run start

###MANEJO LOGICA PARA SUBIDA DE ARCHIVOS DE ONE DRIVE
token.model.js
OneDrive.controller.js
axiosOneDrive.helper.js
token.helpers.js
Microsoft.middleware.js
OneDrive.routes.js

$4 IMPORTANTE PENDIENTE POR RELIZAR ESTAS VALIDACIONES.

Si un programa no tiene un formulario de inscripción asignado, debe mostrar un mensaje al usuario.


Al crear formularios colocar para que se tenga diferentes opciones de respuesta: texto, número, date, opción multiple

Creación de formularios para programa:
validar que el email del colaborador responsable se devuelva en la API.

Diligenciamiento de formulario:

Validar bien si se puede registrar varios participantes que tenga una misma fecha de nacimiento

--------------------------------

Este proyecto tiene una arquitectura sólida basada en la separación de capas.
Estructura y Arquitectura por Capas
Capa de Presentación (Frontend - Angular)
Lógica de negocio:
•	Mappers, Models, dto, helpers, implementaciones de repositorios.
•	Models: Contienen las estructuras de datos utilizadas en la aplicación (como usuarios, programas, roles, etc.).
•	Mappers: Se encargan de la transformación de datos entre diferentes capas. En este caso, se utilizan para convertir datos entre el frontend y el backend.
•	DTO (Data Transfer Objects): Sirven para transportar datos entre el frontend y el backend a través de la API.
•	Helpers: Contienen utilidades y funciones auxiliares para manejo de datos, transformación o manipulación de los mismos.
•	Implementación de Repositorios: Encargados de la interacción directa con el backend (Node.js), como enviar solicitudes HTTP para crear, leer, actualizar y eliminar datos.
1.	Acceso a datos: Repositorios: Proveen acceso a datos, haciendo abstracción de la fuente de datos (API REST).
Seguridad (Interceptor y Guards):
o	Interceptor: Asegura que todas las solicitudes HTTP lleven el token de autenticación (JWT) cuando sea necesario.
o	Guards: Protegen rutas y módulos en la aplicación para asegurar que solo los usuarios autenticados o con ciertos roles accedan a ellos.
Servicios
•	Servicios de Aplicación: Los servicios se encargan de manejar la lógica de negocio del frontend y comunicarse con el backend.
o	Servicios como token, autenticación, colaborador, programa, rol, usuarios, tipos de identificación se gestionan aquí, cada uno responsable de una parte clave de la lógica de negocio del sistema.
o	Cada servicio se comunica con el backend a través de interfaces definidas en la carpeta helpers, lo que asegura que la lógica de comunicación esté desacoplada y sea fácilmente mantenible.
Componentes y Módulos)
•	Componentes: Los elementos visuales de la aplicación. Están distribuidos por módulos:
o	Autenticación: Login, registro y manejo de sesiones.
o	Formulación: Creación y edición de programas.
o	Ejecución de Programas: Monitorización y gestión de la ejecución de proyectos.
o	Programas, Usuarios: Gestión de usuarios, roles, y programas.
o	Material Module: Centraliza los componentes de Angular Material utilizados en toda la aplicación.
Capa de Lógica de Negocio y Aplicación (Backend - Node.js)
•	Modelos (Models): Representan las entidades del sistema (usuarios, programas, roles, etc.), que están directamente conectadas a la base de datos.
•	DTO y Mappers: Manejan la conversión de los datos entre el backend y el frontend, transformando las respuestas de las consultas en objetos que la aplicación pueda manejar.
•	Controladores: Son los responsables de gestionar las peticiones HTTP (GET, POST, PUT, DELETE) que llegan al backend. Reciben los datos de los clientes, procesan la lógica de negocio y envían las respuestas. Para este proyecto los controladores se encargan de las peticione y lógica del negocio ya que no hay implementada una capa de servicios.
o	Cada controlador tiene una función clara. Por ejemplo, hay controladores para gestionar usuarios, programas, roles, etc.
•	Helpers: Funciones utilitarias o auxiliares que pueden incluir la validación de datos, transformación, o funciones compartidas entre diferentes partes de la aplicación.
•	Middlewares: Funciones que se ejecutan antes de los controladores, manejando tareas comunes como la validación de JWT, autorización de roles, manejo de errores, etc.
•	Rutas: Establecen las direcciones URL que la aplicación expone y las vinculan con los controladores.
•	Configuración: Almacena las configuraciones globales, como la conexión con la base de datos y la creación del superusuario (administrador) de la aplicación.
------------------------------
Autenticación (JWT y Microsoft OneDrive)
•	JWT (JSON Web Tokens): Se utiliza para la autenticación de los usuarios. Después de que un usuario inicia sesión, se le asigna un token JWT, que se debe enviar en todas las solicitudes protegidas para verificar la autenticidad del usuario.
•	OneDrive API (Microsoft): Integrado como un servicio externo, permite almacenar documentos PDF y Word generados por los usuarios. Estos documentos se suben a OneDrive, y los enlaces a los documentos se almacenan en la base de datos.
Esta arquitectura te permite una excelente separación de preocupaciones, manteniendo la lógica de negocio, la persistencia de datos y la presentación completamente desacopladas, con la posibilidad de expandirse en el futuro.
-------------------------------------------


¿Cómo ES EL ACCESO A DATOS EN MI PROYECTO?
el acceso a datos y la integración se pueden explicar a través de las capas de la arquitectura que has descrito, siguiendo los principios de la arquitectura limpia y separando adecuadamente las responsabilidades entre las capas. A continuación, te explicaré cómo estas partes se interrelacionan en el flujo de datos e integración entre el backend, la base de datos (MongoDB), el frontend y los servicios externos como Microsoft OneDrive y el correo electrónico.
Acceso a Datos
Backend:
En el backend, la estructura que proporcionaste sigue una separación de responsabilidades clara, donde los datos fluyen desde la base de datos hacia los controladores y viceversa. Aquí es donde entra en juego la capa de acceso a datos.
•	Modelos (Dominio):
o	En tu backend, los modelos dentro del dominio son responsables de representar las entidades clave del sistema, como usuarios, programas, roles, etc. Estos modelos son mapeados a documentos de MongoDB y contienen la estructura de datos que la aplicación manejará.
•	DTO y Mappers (Backend):
o	Los DTOs (Data Transfer Objects) y los mappers se encargan de transformar los datos que se envían y reciben entre la capa de dominio y la capa de aplicación o presentación. El uso de DTOs ayuda a garantizar que solo los datos necesarios sean expuestos en las API, lo cual es importante para seguridad y rendimiento.
•	Repositorio (Acceso a Datos):
o	Aunque no mencionaste explícitamente una capa de repositorios en el backend, puedes considerar tener un patrón de Repositorio para gestionar el acceso a la base de datos. Este patrón encapsula las operaciones CRUD de MongoDB, permitiendo que los controladores y servicios no accedan directamente a la base de datos. Esto proporciona una abstracción sobre las consultas, lo que facilita cambios futuros en la persistencia sin afectar la lógica de negocio.
Ejemplo de flujo de acceso a datos en el backend:
1.	Un controlador recibe una petición HTTP (p. ej., crear un programa).
2.	El controlador llama a un servicio que implementa la lógica de negocio.
3.	El servicio se comunica con el repositorio, que ejecuta operaciones en la base de datos utilizando los modelos.
4.	Los datos recuperados o modificados por el repositorio se devuelven al servicio y luego al controlador, que responde con un DTO al cliente.
Frontend:
•	Servicios (Angular):
o	Los servicios en el frontend son responsables de comunicarse con el backend para obtener o enviar datos a través de HTTP. Cada servicio en Angular realiza peticiones a las APIs REST del backend para interactuar con las entidades del sistema.
•	Modelos y DTO (Frontend):
o	Similar al backend, el frontend también utiliza modelos y DTOs. Los modelos en el frontend representan la estructura de datos que los componentes necesitan mostrar, y los DTOs en el frontend permiten la transformación de datos en el formato adecuado antes de enviarlos al backend.
Integración
Autenticación (JWT):
•	El sistema utiliza JSON Web Tokens (JWT) para manejar la autenticación y autorización de usuarios. Cuando un usuario inicia sesión, el backend genera un token JWT que contiene los permisos y el rol del usuario. Este token se envía al frontend y se almacena (probablemente en localStorage o sessionStorage).
•	Interceptor (Angular): En el frontend, tienes un interceptor de seguridad que captura las peticiones HTTP salientes y adjunta el token JWT en los encabezados, lo que permite al backend validar que el usuario tiene los permisos correctos para ejecutar la acción.
Microsoft OneDrive (Almacenamiento de documentos):
•	Para manejar la integración con Microsoft OneDrive, probablemente tienes un servicio en el backend que se encarga de conectarse a la API de OneDrive para almacenar documentos como PDFs y archivos Word que los usuarios generan o suben.
•	Esta integración puede funcionar a través de peticiones API al servicio de OneDrive utilizando OAuth para autenticar y autorizar las solicitudes a la nube. Los documentos subidos pueden ser vinculados a los programas o usuarios en tu base de datos MongoDB mediante referencias o IDs.
Correo Electrónico (Notificaciones):
•	Para el envío de notificaciones por correo electrónico, probablemente tienes un servicio de correo (como nodemailer en el backend) que se encarga de enviar correos electrónicos en ciertos eventos, como cuando un programa es creado, modificado o activado.
•	El servicio de correo probablemente interactúa con servicios SMTP o una API de correo (como SendGrid) para enviar correos. Las notificaciones pueden ser configuradas para que se envíen a colaboradores o responsables de programas.
Resumen de la Arquitectura de Acceso a Datos e Integración
1.	Frontend (Angular):
o	El usuario interactúa con la UI de Angular.
o	Los servicios de Angular envían y reciben datos del backend a través de HTTP requests (API REST) con el token JWT para autenticación.
2.	Backend (Node.js - Express):
o	El backend recibe las solicitudes HTTP y pasa los datos a través de los controladores.
o	Los controladores delegan la lógica a los servicios, que utilizan los repositorios para interactuar con MongoDB.
o	El backend usa mappers y DTOs para transformar los datos antes de enviarlos al frontend.
o	Se integra con servicios externos como Microsoft OneDrive para el almacenamiento de documentos y un servicio de correo electrónico para las notificaciones.
3.	Base de Datos (MongoDB):
o	MongoDB almacena los documentos que representan los programas, usuarios, colaboradores, y más.
o	Las operaciones CRUD en MongoDB son manejadas por los repositorios del backend, que abstraen las consultas directas.
4.	Servicios Externos:
o	Microsoft OneDrive: Para almacenar documentos PDF y Word creados por los usuarios.
o	Correo electrónico: Para enviar notificaciones sobre eventos importantes en la plataforma.
Acceso a Datos Actual (CRUD en Controladores)
Backend (Node.js - Express):
En tu arquitectura actual, los controladores son responsables de gestionar directamente las operaciones CRUD con MongoDB. Esto implica que los controladores manejan las interacciones con los modelos (que son las representaciones de las entidades en MongoDB) para realizar operaciones como crear, leer, actualizar y eliminar documentos.
Flujo actual:
1.	Solicitud HTTP: El controlador recibe una solicitud HTTP (por ejemplo, POST, GET, PUT, DELETE) desde el frontend.
2.	Controlador CRUD: El controlador ejecuta directamente la operación CRUD utilizando los modelos o conectores de MongoDB.
1.	Respuesta HTTP: El controlador devuelve una respuesta HTTP con el resultado de la operación, como una confirmación de creación o los datos obtenidos en una consulta.
Consecuencias de este Enfoque
1.	Acoplamiento entre Lógica de Negocio y Acceso a Datos: Al manejar las operaciones CRUD directamente en los controladores, se mezcla la lógica de acceso a datos con la lógica de control (manejo de rutas, solicitudes, etc.). Esto puede dificultar la mantenibilidad, ya que los controladores deben gestionar tanto la comunicación con la base de datos como la lógica de negocio.
2.	Reutilización Limitada: Si tienes múltiples controladores que necesitan realizar operaciones similares (por ejemplo, crear un programa o consultar usuarios), debes repetir las operaciones CRUD en cada uno de ellos. Esto puede conducir a duplicación de código.
3.	Dificultad para Cambiar la Fuente de Datos: Si en el futuro quisieras cambiar de base de datos (por ejemplo, pasar de MongoDB a otra base de datos), tendrías que modificar cada controlador que interactúa con la base de datos, lo cual sería un esfuerzo considerable.
AUTENTICACIÓN JWT:
En la estructura de tu proyecto, el uso de JSON Web Tokens (JWT) para la autenticación sigue un patrón común donde el token JWT se utiliza para identificar y autenticar a los usuarios en las solicitudes al backend. A continuación, te explicaré cómo encaja el manejo del token JWT en cada parte de tu arquitectura, cómo interactúan los componentes y cómo puedes explicar este flujo en términos de autenticación y seguridad.
Flujo de Autenticación JWT en tu Proyecto
1.	Inicio de Sesión (Autenticación):
o	El proceso de autenticación se inicia cuando un usuario intenta iniciar sesión proporcionando credenciales (nombre de usuario y contraseña) desde el frontend de Angular.
o	Estas credenciales son enviadas al backend a través de una solicitud HTTP POST a la ruta de autenticación, por ejemplo, POST /login.
2.	Verificación de Credenciales:
o	En el backend (Node.js - Express), un controlador recibe esta solicitud y pasa las credenciales a un servicio de autenticación que valida las credenciales contra la base de datos (MongoDB).
o	Si las credenciales son válidas, el servicio de autenticación genera un token JWT.
