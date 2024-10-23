const { Router } = require("express");
const { Producto, Categoria } = require("../db.js");
const {Op} = require('sequelize');
const { isAdmin } = require("../controllers/user.controller.js");
const logActivity = require('../utils/logActivity');

const router = Router();

router.post('/', isAdmin, async(req, res) => {
    const {id, nombre, precio, categoria, subcategoria, descripcion, urlimagen, marca, stock, idcategoria, medidas} = req.body;
    try{
        console.log("Datos recibidos en el backend:", req.body);

        const cat = await Categoria.findOrCreate({
            where: { id: idcategoria },
            defaults: { id: idcategoria, nombre: subcategoria }
        });

        const creado = await Producto.create({
            id, // Añadimos el id aquí
            nombre,
            descripcion,
            categoria,
            subcategoria,
            marca,
            precio,
            urlimagen,
            stock: stock || Math.floor(Math.random() * 50) + 10, // Stock aleatorio si no se proporciona
            medidas,
            idcategoria, // Añadimos idcategoria aquí
            categoriaId: cat[0].id
        });

        // Registrar en bitácora
        logActivity(req.user.id, 'Creación de producto', { productId: creado.id }, req.ip);

        res.status(201).json(creado);
    }catch(e){
        console.error("Error detallado:", e);
        console.error("Datos recibidos:", req.body);
        res.status(400).json({ error: e.message });
    }
})

module.exports = router;
