const { Router } = require("express");
const { ProductosFav } = require("../db.js");
const router = Router();

// Ruta para eliminar favorito
router.delete("/:userId/:productId", async (req, res) => {
    try {
        const { userId, productId } = req.params;
        
        console.log('Intentando eliminar favorito:', { userId, productId });
        
        const result = await ProductosFav.destroy({
            where: {
                usuarioId: userId,
                productId: productId.toString()
            }
        });
        
        console.log('Resultado de eliminación:', result);
        
        if (result > 0) {
            res.status(200).json({
                success: true,
                message: 'Favorito eliminado correctamente'
            });
        } else {
            res.status(404).json({
                success: false,
                message: 'No se encontró el favorito'
            });
        }
    } catch (error) {
        console.error('Error en eliminación:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
