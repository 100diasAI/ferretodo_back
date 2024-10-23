const { Router } = require("express");
const { isAdmin } = require("../controllers/user.controller.js");
const { Usuario } = require("../db.js");

const router = Router();
// OBTENER TODOS LOS USERS 
router.get('/', async (req,res) => {
  try {
    const users = await Usuario.findAll();
    res.json(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
