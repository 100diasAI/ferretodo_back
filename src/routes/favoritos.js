const { Router } = require("express");
const { ProductosFav, Usuario, Producto } = require("../db.js");

const router = Router();
//! GET wishlist de un usuario
router.get("/:id", async (req, res, next) => {
  try {
    const favoritos = await ProductosFav.findAll({
      include: {
        model: Usuario,
        Producto,
        where: { id: req.params.id },
      },
    });

    res.status(200).send(favoritos);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
