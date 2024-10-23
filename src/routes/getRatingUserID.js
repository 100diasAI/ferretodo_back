const { Router } = require("express");
const { Rating } = require("../db.js");

const router = Router();

// GET ratings de un usuario

router.get("/:id", async (req, res) => {
  try {
    const reviews = await Rating.findAll({
      where: { usuarioId: req.params.id },
    });

    res.status(200).send(reviews);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
