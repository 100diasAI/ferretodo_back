const { Router } = require("express");
const { isAdmin } = require("../controllers/user.controller.js");
const { Pedido } = require("../db.js");

const router = Router();

// DELETE pedido con id

router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const pedidoABorrar = await Pedido.findByPk(id);
    await pedidoABorrar.destroy();
    res.status(200).send(id);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
