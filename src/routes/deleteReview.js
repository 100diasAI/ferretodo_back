const { Router } = require("express");
const { isAdmin } = require("../controllers/user.controller.js");
const { Rating } = require("../db.js");

const router = Router();

//DELETE reviews con id

router.delete("/:id", isAdmin, async (req, res, next) => {
  try {
    const id = req.params.id;
    const ratingABorrar = await Rating.findByPk(id);
    await ratingABorrar.destroy();
    res.json({ msg: "borrado" });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
