const { Router } = require("express");
const { isAdmin } = require("../controllers/user.controller.js");
const { Categoria } = require("../db.js");

const router = Router();

// DELETE categorias con id
router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const catABorrar = await Categoria.findByPk(id);
    if (!catABorrar) {
      return res.status(404).json({ error: "Categoría no encontrada" });
    }
    await catABorrar.destroy();
    res.json({ id, message: "Categoría eliminada exitosamente" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
