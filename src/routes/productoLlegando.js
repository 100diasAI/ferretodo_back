const { Router } = require("express");
const {Usuario} = require("../db.js");

const router = Router();

router.post("/", async (req, res) => {
    try {
      const { userId } = req.body;
  
      const usuario = await Usuario.findByPk(userId);
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "henrypfg11@gmail.com",
          pass: "Elpepe88",
        },
      });
      var mailOptions = {
        from: '"Henry Grupo 11 ☕" <henrypfg11@gmail.com>',
        to: usuario.mail,
        subject: "Hello ✔",
        text: "El producto se encuentra en el último tramo del recorrido !",
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(500).send(error.message);
        } else {
          res.status(200).jsonp(req.body);
        }
      });
    } catch (err) {
      console.log(err.message);
    }
  });







module.exports = router;