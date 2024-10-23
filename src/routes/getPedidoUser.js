const { Router } = require("express");
const { Pedido, Producto } = require("../db.js");

const router = Router();

//GET todos los pedidos de un usuario

router.get("/:id", async (req, res) => {
  try {
    const pedidos = await Pedido.findAll({
      include: [
        {
          model: Producto,
          attributes: ["nombre", "imagen"],
          through: { attributes: ["cantidad", "productoId"] },
        },
      ],
      where: { usuarioId: req.params.id },
      order: ["fecha"],
    });

    res.status(200).send(pedidos);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
