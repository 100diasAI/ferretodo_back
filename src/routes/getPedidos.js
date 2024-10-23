const { Router } = require("express");
const { Op } = require("sequelize");
const { Pedido, Producto } = require("../db.js");

const router = Router();

//! GET todos los pedidos
router.get("/", async (req, res) => {

  console.log(req.query.search)

  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Producto,
          attributes: ["nombre"],
          through: { attributes: ["cantidad", "productoId"] },
          where: req.query.search && {nombre: {[Op.iLike]: `%${req.query.search}%`}},
        },
      ]
    });

    res.status(200).send(pedidos);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = router;
