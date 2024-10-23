const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cookieSession = require("cookie-session");
const cors = require("cors"); // Agregamos cors
const { FRONTEND_URL } = process.env;
require("./db.js");


const baseURL = FRONTEND_URL?.replace(/\/$/, "") || "http://localhost:3000" || "https://shopping-online-production.up.railway.app/"; // Elimina barra diagonal al final
const server = express();
const dotenv = require('dotenv');

dotenv.config();
server.name = "API";

// Configuración de CORS
const corsOptions = {
  origin: baseURL, // Sin barra diagonal al final
  credentials: true, // Permite envío de cookies
  methods: "GET, POST, OPTIONS, PUT, DELETE", // Métodos permitidos
  allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept" // Cabeceras permitidas
};

server.use(cors(corsOptions)); // Usamos cors como middleware

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

server.use(cookieParser());
server.use(morgan("dev"));

server.use(
  cookieSession({
    name: "FOOD-API",
    secret: process.env.COOKIE_SECRET, // Crear variable
    httpOnly: false,
    sameSite: "strict",
    secure: false
  })
);

// para acceder a info sensible primero verificar el id desde la galleta req.session.userId
// if (!req.session.userId) {
//   throw new Error("not authenticated");
// }

server.use("/", routes);

// Error catching endware.
server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = server;
