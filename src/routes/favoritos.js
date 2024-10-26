const { Router } = require("express");
const { ProductosFav, Usuario, Producto } = require("../db.js");

const router = Router();

router.get("/:userId", async (req, res, next) => {
  try {
    console.log("Buscando favoritos para el usuario:", req.params.userId);
    const favoritos = await ProductosFav.findAll({
      where: { usuarioId: req.params.userId },
      include: [{ model: Producto }]
    });
    console.log("Favoritos encontrados:", JSON.stringify(favoritos, null, 2));

    const favoritosIds = favoritos.map(fav => fav.productId);
    console.log("IDs de favoritos:", favoritosIds);
    res.status(200).json(favoritosIds);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

