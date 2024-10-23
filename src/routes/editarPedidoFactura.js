const { Router } = require("express");
const {DatosFactura, Pedido, Compra, Producto} = require("../db.js");
const {Op} = require('sequelize');
const { isAdmin, isAuthenticated } = require("../controllers/user.controller.js");
const queue = require('express-queue');
const nodemailer = require('nodemailer');

const router = Router();

router.put('/', queue({ activeLimit: 1, queuedLimit: -1}), async(req, res) => {
    try{
        const {idPedido, montoTotal, nroOperacion, estado} = req.body;
        let pedido = await Pedido.findOne({where:{id: idPedido}});
        let factura = await pedido.getDatosFactura();

        if(estado === 'Aprobado' && pedido.dataValues.estado === 'Pendiente de pago'){
            //Envio mail
            const { mail } = req.body;
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
              html:`
              <div>
                <h1>¡Hola!</ h1>
                <h2>Nos complace notificarte que tu pedido #${idPedido} fue Aprobado.</ h2>
                <h3>La operación de $${pedido.pago_total}* se realizó bajo el número: ${nroOperacion}.</h3>
                <hr />
                <p><em>*El monto no incluye impuestos y/o tasas bancarias</ p>
              </ div>
              `
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                console.log(error.message);
              }
            });

            const compras = await Compra.findAll({
                where: {
                  pedidoId: idPedido,
                  done: false
                }
              })
            for(let i = 0; i < compras.length; i++){
                const producto = await Producto.findByPk(compras[i].dataValues.productoId);
                
                if (producto) {
                    await producto.update({
                        stock: Math.max(0, producto.stock - compras[i].dataValues.cantidad)
                    });
                }

                await compras[i].update({done: true});
            }
        }

        const montoActualizado = await DatosFactura.update({montoTotal},{where: {id: factura.id}});
        const pedidoActualizado = await Pedido.update({nroOperacion, estado},{where:{id: idPedido}})
        pedido = await Pedido.findOne({where:{id: idPedido}, include: DatosFactura});

        res.send(pedido);
    }catch(e){
        console.log(e)
    }
})


module.exports = router;
