const { Router } = require("express");
const {Sucursales} = require("../db.js");
const {Op} = require('sequelize')

const router = Router();

router.get('/', async(req, res) => {
    let sucursales = await Sucursales.findAll();
    res.status(200).send(sucursales);
})


module.exports = router;
