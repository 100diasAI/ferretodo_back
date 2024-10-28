const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");
const cookieSession = require("cookie-session");
const cors = require("cors");
const { FRONTEND_URL } = process.env;
const { FRONTEND_URL_LOCAL } = process.env;
require("./db.js");

const baseURL = FRONTEND_URL?.replace(/\/$/, "") || FRONTEND_URL_LOCAL?.replace(/\/$/, "") || "https://farretodo-production.up.railway.app";
const server = express();
const dotenv = require('dotenv');

dotenv.config();
server.name = "API";

// Configuración mejorada de CORS
const corsOptions = {
  origin: [
    baseURL,
    'https://farretodo-production.up.railway.app',
    'http://localhost:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
    'Pragma',
    'Expires'
  ]
};

server.use(cors(corsOptions));

// Middleware adicional para headers CORS
server.use((req, res, next) => {
  const origin = req.headers.origin;
  if (corsOptions.origin.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', corsOptions.methods);
  res.header('Access-Control-Allow-Headers', corsOptions.allowedHeaders.join(', '));
  next();
});

server.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
server.use(bodyParser.json({ limit: "50mb" }));

server.use(cookieParser());
server.use(morgan("dev"));

server.use(
  cookieSession({
    name: "FOOD-API",
    secret: process.env.COOKIE_SECRET,
    httpOnly: false,
    sameSite: "strict",
    secure: process.env.NODE_ENV === 'production'
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

server.set('trust proxy', true);

module.exports = server;
