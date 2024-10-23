const { Router } = require("express");
const router = Router();
const mercadopago = require("mercadopago");
const { isAuthenticated } = require("../controllers/user.controller");
//Provisional de esta forma, luego va en el .env
const ACCESS_TOKEN = "APP_USR-2136680771902247-071214-4767199d5dfa22b7c0885a9e58ff3bec-1159384629";

mercadopago.configure({
    access_token: ACCESS_TOKEN,
});

router.post("/", isAuthenticated, (req, res) => {
    try{
        const {items, datos, pedidoGenerado} = req.body
        console.log(req.body)
        const idPedido = pedidoGenerado.pedido.id;
        const productos = [];
        items.map((p) => {
            let item = {
                title: p.nombre,
                unit_price: p.precio,
                quantity: p.cantidad,
                description: p.descripcion,
                picture_url: p.urlimagen,
                category_id: p.subcategoria,
            }
            productos.push(item);
        })

        const pagador = {
            name: datos.nombre,
            surname: datos.apellido,
            identification: {
                type: "DNI",
                number: datos.documento
            },
            address: {
                street_name: datos.direccion
            }
        }
        
        let preference = {
            items: productos,
            payer: pagador,
            payment_methods: {
                excluded_payment_types: [
                    {
                        id: "ticket"
                    }
                ],
                installments: 12
                },
            back_urls:{
                success: "http://localhost:3000/checkout/success/"+idPedido,
                failure: "http://localhost:3000/checkout/success/"+idPedido,
            },
            auto_return: "approved",
            binary_mode: true,
        };

        mercadopago.preferences.create(preference)
            .then(function(response){
                res.json(response.body);
            }).catch(function (error){
                console.log(error);
                res.send("Se ha producido un error");
            })
    }catch(e){
        console.log(e);
        res.send("Se ha producido un error");
    }
})

module.exports = router;
