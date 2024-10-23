const { Router } = require("express");
const { Pedido, Usuario, Compra } = require("../db.js");
const nodemailer = require('nodemailer');

const router = Router();

// PUT Pedido para poder cambiar el estado
router.put("/", async (req, res) => {
  const { id,
    pago_total,
    fecha,
    direccion_de_envio,
    estado } =
    req.body;

  try {
    await Pedido.update(
      {
        pago_total,
        fecha,
        direccion_de_envio,
        estado
      },
      { where: { id } }
    );

    const pedidos = await Pedido.findOne({
      include: [
        {
          model: Usuario,
        },
      ],
      where: { id: id },
    });
    console.log(pedidos.dataValues.usuario.dataValues);
    const {nombre} = pedidos.dataValues.usuario.dataValues;
    let htmlContenido = "";
    switch(estado){
      case "En Preparacion":
        htmlContenido =` <div>
            <h1>¡Hola, ${nombre}!</ h1>
            <h2>Nos complace notificarte que tu pedido #${id} se encuentra en preparación.</ h2>
            <h3>Pronto te notificaremos cómo continúa el proceso.</h3>
          </ div>
        `
        break;
      case "En Camino":
        htmlContenido =` <div>
            <h1>¡Hola, ${nombre}!</ h1>
            <h2>Nos complace notificarte que tu pedido #${id} se encuentra en camino.</ h2>
            <h3>Pronto te notificaremos cómo continúa el proceso.</h3>
          </ div>
        `
        break;
      case "En Punto De Entrega":
        htmlContenido =` <div>
            <h1>¡Hola, ${nombre}!</ h1>
            <h2>Nos complace notificarte que tu pedido #${id} se encuentra en el punto de entrega seleccionado.</ h2>
            <h3>Podrás retirarlo acercandote al punto de entrega seleccionado.</h3>
            <p>Recordá traer DNI y el número de pedido al momento de reitrar.</p>
          </ div>
       `
       break;
       case "En Poder Del Correo":
        htmlContenido =` <div>
            <h1>¡Hola, ${nombre}!</ h1>
            <h2>Nos complace notificarte que tu pedido #${id} se encuentra en poder del correo responsable de la entrega.</ h2>
            <h3>La entrega se realizará en los próximos días hábiles.</h3>
            <p>Recordá tener DNI en mano al momento de recibir.</p>
          </ div>
       `
       break;
       case "Entregado":
        htmlContenido = ` <div>
            <h1>¡Hola, ${nombre}!</ h1>
            <h2>Nos complace notificarte que tu pedido #${id} ya fue entregado.</ h2>
            <h3>La entrega se realizó exitosamente.</h3>
            <p>¡Que lo disfrutes! Recordá dejar tu reseña para que más personas se animen a comprarlo.</p>
          </ div>
       `
       break;

    }

    const mail = pedidos.dataValues.usuario.dataValues.mail;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "henrypfg11@gmail.com",
        pass: "chirxatvtficaopa",
      },
    });
    var mailOptions = {
      from: '"FerreTodo" <henrypfg11@gmail.com>',
      to: mail,
      subject: "Cambio de estado en su pedido ✔",
      // text: "Tu pedido ha sido " + estado,
      html: htmlContenido
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error.message);
      }
    });

    res.status(200).send(id);
  } catch (error) {
    res.status(400).send(error);
  }
});

module.exports = router;

// router.put("/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const pedido = await Pedido.findByPk(id);
//     const { pago_total, direccion_de_envio, estado, fecha } = req.body;

//     if (pago_total) {
//       pedido.pago_total = pago_total;
//       pedido.save();
//     }

//     if (fecha) {
//       pedido.fecha = fecha;
//       pedido.save();
//     }

//     if (direccion_de_envio) {
//       pedido.direccion_de_envio = direccion_de_envio;
//       pedido.save();
//     }
//     if (estado) {
//       pedido.estado = estado;
//       pedido.save();
//     }
//     res.status(200).send(id);
//   } catch (error) {
//     res.status(400).send(error);
//   }
// });

// module.exports = router;