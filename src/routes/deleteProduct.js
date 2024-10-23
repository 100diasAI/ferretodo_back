const { Router } = require("express");
const { isAdmin } = require("../controllers/user.controller.js");
const { Producto } = require("../db.js");

const router = Router();

// DELETE producto con id

router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const productoABorrar = await Producto.findByPk(id);
    if (!productoABorrar) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    await productoABorrar.destroy();
    res.json({ id, message: "Producto eliminado exitosamente" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
