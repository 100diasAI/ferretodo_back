const { Router } = require("express");
const { Usuario } = require("../db.js");
const usuariosDB = require("../models/assets/usuarios.json");

const router = Router();

// POST cargar usuarios en la base de datos
router.post("/", async (req, res) => {
  try {
    const producto = await Usuario.bulkCreate(usuariosDB);

    res.status(200).send(producto);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
    req.cookies;
  }
});

module.exports = router;
