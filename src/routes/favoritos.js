const { Router } = require("express");
const { ProductosFav, Usuario, Producto } = require("../db.js");

const router = Router();

router.get("/:userId", async (req, res, next) => {
  try {
    const favoritos = await ProductosFav.findAll({
      where: { UsuarioId: req.params.userId },
      include: [{ model: Producto }]
    });

    const favoritosIds = favoritos.map(fav => fav.Producto.id);
    res.status(200).json(favoritosIds);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
