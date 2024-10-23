const { Router } = require("express");
const { Producto, Categoria } = require("../db.js");

const router = Router();

router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Producto.findByPk(id, {
      include: [Categoria],
    });
    if (product) return res.status(200).send(product);
    else return res.status(400).send({ Error: "Ese producto no existe." });
  } catch (error) {
    return res.status(500).send({ Error: "Error al buscar el producto." });
  }
});

module.exports = router;
