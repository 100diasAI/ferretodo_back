const { Router } = require("express");
const { Producto, Categoria } = require("../db.js");
const { Op } = require('sequelize');
const { isAdmin } = require("../controllers/user.controller.js");

const router = Router();

router.put('/', isAdmin, async(req, res) => {
    const { id, nombre, precio, categoria, subcategoria, descripcion, urlimagen, marca, stock } = req.body;
    const productoParaActualizar = { nombre, descripcion, urlimagen, precio, subcategoria, marca, stock };
    try {
        const prodActualizado = await Producto.update(productoParaActualizar, { where: { "id": id } });
        const prod = await Producto.findByPk(id);
        
        if (categoria) {
            const cat = await Categoria.findOne({ where: { "id": categoria } });
            if (cat) {
                await prod.setCategoria(cat);
            } else {
                throw new Error("Categoría no encontrada");
            }
        }

        res.status(200).send("Actualizado exitosamente");
    } catch (e) {
        console.error(e);
        res.status(400).send(e.message);
    }
});

module.exports = router;
