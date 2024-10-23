const { Router } = require("express");
const { Rating } = require("../db.js");

const router = Router();

// GET todos los ratings
router.get("/", async (req, res) => {
  try {
    const rating = await Rating.findAll();
    res.status(200).send(rating);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;
