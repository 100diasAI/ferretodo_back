const { Router } = require("express");
const { ProductosFav, Usuario, Producto } = require("../db.js");

const router = Router();

// DELETE producto con id

router.delete("/:userId/:productId", async (req, res, next) => {
    try {
        const { userId, productId } = req.params;
        await ProductosFav.destroy({
            where: {
                productId: parseInt(productId),
                usuarioId: userId
            }
        });
        res.status(200).json({ message: 'Favorito eliminado' });
    } catch (error) {
        next(error);
    }
});

router.get("/:id", async (req, res, next) => {
  try {
    const favoritos = await ProductosFav.findAll({
      where: { usuarioId: req.params.id },
      include: [{ model: Producto }]
    });

    const favoritosIds = favoritos.map(fav => fav.Producto ? fav.Producto.id : null).filter(id => id !== null);
    res.status(200).json(favoritosIds);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
