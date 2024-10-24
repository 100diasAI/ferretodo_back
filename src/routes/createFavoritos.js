const { Router } = require("express");
const { isAuthenticated } = require("../controllers/user.controller.js");
const { ProductosFav } = require("../db.js");

const router = Router();

router.post('/', isAuthenticated, async(req, res, next) => {
    const { userId, productId } = req.body;
    try {
        const [fav, created] = await ProductosFav.findOrCreate({
            where: {
                UsuarioId: userId,
                productId: productId
            }
        });
        res.status(created ? 201 : 200).json({
            id: productId,
            message: created ? 'Favorito creado' : 'Favorito ya existente'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
