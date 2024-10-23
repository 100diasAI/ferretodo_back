const { Router } = require("express");
const {Usuario} = require("../db.js");
const nodemailer = require('nodemailer');
const router = Router();



router.post("/", async (req, res) => {
    try {
      const { mail } = req.body;
      console.log(mail)
      // const usuario = await Usuario.findByPk(userId);
      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "henrypfg11@gmail.com",
          pass: "chirxatvtficaopa",
        },
      });
      var mailOptions = {
        from: '"Henry Grupo 11 ☕" <henrypfg11@gmail.com>',
        to: mail,
        subject: "Hello ✔",
        text: "Compra confirmada",
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