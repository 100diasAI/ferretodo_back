const server = require("./src/app.js");
const { conn } = require("./src/db.js");
const PORT = process.env.DB_PORT
const {
  Producto,
  Categoria,
  Usuario,
  Pedido,
  Compra,
  Sucursales,
} = require("./src/db.js");

const fs = require("fs");
const { hashPassword } = require("./src/helpers/hashPassword.js");

// Syncing all the models at once.
// Seteado en el valor que ponga en el .env
conn
  .sync({ force: true })
  .then(() => {
    server.listen(process.env.PORT, async () => {
      //Cuento los productos para ver si ya fueron cargados antes.
      const productosCuenta = await Producto.count();
      if (productosCuenta !== 0) {
        console.log("Los productos ya estaban cargados en la DB.");
        return;
      }
      console.log(`%s listening at ${process.env.PORT}`);
      const productosJSON = JSON.parse(
        fs.readFileSync(__dirname + "/src/models/assets/productos.json")
      );
      //Cargar data en la DB
      (async function () {
        //Por cada producto del JSON, creo una entrada de su categoria en la DB (si no existe) y, a partir de la categoria, creo el producto para asociarlo con ella.
        for (const p of productosJSON) {
          console.log('Procesando producto:', p.id);
          console.log('Tipo de id:', typeof p.id);
          
          const [categoria] = await Categoria.findOrCreate({
            where: { id: p.idcategoria },
            defaults: { id: p.idcategoria, nombre: p.categoria }
          });

          // Generar un stock aleatorio entre 20 y 500
          const randomStock = Math.floor(Math.random() * (500 - 20 + 1)) + 20;

          try {
            await Producto.create({
              id: p.id,
              nombre: p.nombre,
              descripcion: p.descripcion,
              subcategoria: p.subcategoria,
              marca: p.marca,
              precio: parseFloat(p.precio),
              urlimagen: p.urlimagen,
              stock: randomStock,  // Usar el stock aleatorio generado
              categoriaId: categoria.id
            });
            console.log('Producto creado exitosamente:', p.id, 'con stock:', randomStock);
          } catch (error) {
            console.error('Error al crear producto:', p.id, error);
          }
        }

        //Agarro los usuarios del JSON
        const usuariosJSON = JSON.parse(
          fs.readFileSync(__dirname + "/src/models/assets/usuarios.json")
        );

        //Por cada usuario del JSON, creo un usuario en la DB con su data (encriptando la pass).
        for (const u of usuariosJSON) {
          await Usuario.create({
            id: u.id,
            nombre: u.nombre,
            apellido: u.apellido,
            telefono: u.telefono,
            mail: u.mail,
            direccion: u.direccion,
            dni: u.dni,
            contraseña: await hashPassword(u.contraseña),
            isAdmin: u.isAdmin,
            confirmado: true,
            carrito: u.carrito,
          });
        }

        //Saco los pedidos del json
        const pedidosJSON = JSON.parse(
          fs.readFileSync(__dirname + "/src/models/assets/pedidos.json")
        );

        for (const p of pedidosJSON) {
          const pedido = await Pedido.create({
            fecha: p.fecha,
            pago_total: p.pago_total,
            direccion_de_envio: p.direccion_de_envio,
            estado: p.estado,
          });

          for (const id of p.idProductos) {
            const productoDelPedido = await Producto.findByPk(id.toString());
            if (productoDelPedido) {
              await pedido.addProducto(productoDelPedido);
            }
          }

          const david = await Usuario.findOne({
            where: {
              id: "hFLxCkmxGlVFkzPpy7af2b6Eeu02",
            },
          });

          if (david) {
            await david.addPedido(pedido);
          }
        }

        //Agarro las sucursales del JSON
        const sucursalesJSON = JSON.parse(
          fs.readFileSync(__dirname + "/src/models/assets/sucursales.json")
        );

        for (const u of sucursalesJSON) {
          await Sucursales.create({
            nombre: u.nombre,
            capital: u.capital,
            cp: u.cp,
            coordenadas: u.coord,
          });
        }
        console.log("DB loaded.");
      })();
    });
  });
