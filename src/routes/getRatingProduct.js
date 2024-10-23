const { Router } = require("express");
const { Rating, Usuario } = require("../db.js");

const router = Router();

// GET todos los ratings de un producto

router.get("/:productoid", async (req, res) => {
  try {
    const rating = await Rating.findAll({
      where: { productoId: req.params.productoid },
      include: [Usuario],
    });
    res.status(200).send(rating);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
