const { Router } = require("express");
const {Producto} = require("../db.js");
const {Op} = require('sequelize')

const router = Router();

router.get('/', async(req, res) => {
    let subcategorias = await Producto.findAll({
        attributes: ['subcategoria'],
        group: ['subcategoria']
    });
    subcategorias = subcategorias.map(s => s.subcategoria);
    res.status(200).send(subcategorias);
})

module.exports = router;