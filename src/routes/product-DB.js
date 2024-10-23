const { Router } = require("express");
const { Producto } = require("../db.js");

const router = Router();

// POST cargar productos en la base de datos
router.post("/", async (req, res) => {
  try {
    const productosConStock = productosDB.map(producto => ({
      ...producto,
      stock: Math.floor(Math.random() * 50) + 10 // Stock aleatorio entre 10 y 59
    }));

    const productos = await Producto.bulkCreate(productosConStock);

    res.status(200).send(productos);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
