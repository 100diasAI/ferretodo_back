const { Router } = require("express");
const { Producto, Categoria } = require("../db.js");
const { Op } = require('sequelize');

const router = Router();

router.get('/', async(req, res) => {
    try {
        const { name, page = 1, limit = 500 } = req.query;
        
        // Validar página
        const currentPage = parseInt(page);
        if (currentPage <= 0) {
            return res.status(400).json({ 
                success: false,
                error: 'Las páginas deben ser números que empiezan desde el 1.'
            });
        }

        // Configurar la consulta base
        const queryOptions = {
            include: [Categoria],
            offset: limit * (currentPage - 1),
            limit: parseInt(limit),
            distinct: true,
            order: [['id', 'ASC']]
        };

        // Añadir filtro por nombre si existe
        if (name) {
            queryOptions.where = {
                nombre: {
                    [Op.iLike]: `%${name}%`
                }
            };
        }

        // Realizar la consulta
        const { count, rows } = await Producto.findAndCountAll(queryOptions);

        // Calcular información de paginación
        const totalPages = Math.ceil(count / limit);
        
        // Enviar respuesta
        res.status(200).json({
            success: true,
            productos: rows,
            paginacion: {
                total: count,
                porPagina: limit,
                paginaActual: currentPage,
                totalPaginas: totalPages
            }
        });

    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).json({
            success: false,
            error: 'Error al obtener los productos',
            details: error.message
        });
    }
});

module.exports = router;
