const { Router } = require("express");
const { ProductosFav, Usuario, Producto } = require("../db.js");

const router = Router();

router.post('/', async (req, res, next) => {
    const { userId, productId } = req.body;
    try {
        console.log("Creando favorito para usuario:", userId, "producto:", productId);
        const [fav, created] = await ProductosFav.findOrCreate({
            where: {
                usuarioId: userId,
                productId: productId.toString()  // Aseguramos que productId sea un string
            }
        });
        console.log("Favorito creado:", fav.toJSON());
        res.status(created ? 201 : 200).json({
            id: productId,
            message: created ? 'Favorito creado' : 'Favorito ya existente'
        });
    } catch (error) {
        console.error("Error al crear favorito:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
