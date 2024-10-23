const { Router } = require("express");
const { isAdmin } = require("../controllers/user.controller");
const { Producto } = require("../db");
const router = Router();

router.put("/:productId", isAdmin, async (req, res) => {
  const { productId } = req.params;
  const { stock } = req.body;

  try {
    const producto = await Producto.findByPk(productId);
    if (!producto) {
      return res.status(404).send("Producto no encontrado");
    }

    await producto.update({ stock: Math.max(10, 10) });

    return res.send(producto);
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

module.exports = router;
