const { Router } = require("express");
const { ProductosFav, Usuario, Producto } = require("../db.js");

const router = Router();

// DELETE producto con id

router.delete("/:id", async (req, res, next) => {
    const { userId } = req.body;
    try {
        const id = req.params.id;
        await ProductosFav.destroy({
            where: {
                productId: parseInt(id),
                UsuarioId: userId
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
      where: { UsuarioId: req.params.id },
      include: [{ model: Producto }]
    });

    const favoritosIds = favoritos.map(fav => fav.Producto.id);
    res.status(200).json(favoritosIds);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
