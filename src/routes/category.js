const { Router } = require("express");
const {Categoria} = require("../db.js");
const {Op} = require('sequelize');
const { isAdmin } = require("../controllers/user.controller.js");

const router = Router();

router.post('/', isAdmin, async(req, res) => {
    const {id, nombre} = req.body;
    let cat = await Categoria.create({id, nombre});

    res.status(200).send("Categoría añadida con éxito");
})

module.exports = router;
