const { Usuario } = require("../db");
const { generarJWT } = require("../helpers/generarJWT");

const registergoogleAuth = async (req, res) => {
  const { user } = req.body;

  const usuarioEncontrado = await Usuario.findOne({
    where: { mail: user.email },
  });
  console.log(usuarioEncontrado);

  if (usuarioEncontrado) {
    const error = new Error(`El usuario con mail ${user.email} ya existe`);
    return res.status(400).json({ msg: error.message });
  }
  try {
    const createUser = await Usuario.create({
      dni: Math.round(Math.random() * 100),
      nombre: user.given_name,
      apellido: user.family_name,
      direccion: "",
    });

    if (user.email_verified) {
      createUser.confirmado = true;
      createUser.mail = user.email;
      await createUser.save();
      res.json({ msg: "¡Cuenta creada exitosamente!" });
    } else {
      return res.status(400).json({
        msg: `Cuenta con el email: ${user.email} no confirmada, por favor confirmar la cuenta primero`,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const googleAuth = async (req, res) => {
  const { user } = req.body;

  if (user.email_verified) {
    try {
      const usuario = await Usuario.findOne({
        where: { mail: user.email },
      });

      if (!usuario) {
        const error = new Error("El usuario no existe");
        return res.status(400).json({ msg: error.message });
      }
      const token = generarJWT(usuario.id);

      res.cookie("jwt", token);
      return res.status(200).json({
        id: usuario.id,
        name: usuario.nombre,
        email: usuario.mail,
        isAdmin: usuario.isAdmin,
        confirmado: usuario.confirmado,
        token: token,
        lastName: usuario.apellido,
        phone: usuario.telefono,
        address: usuario.direccion,
        dni: usuario.dni,
      });
    } catch (error) {
      console.log(error);
    }
  } else {
    return res
      .status(400)
      .json({ msg: `El usuario no tiene una cuenta verificada con gmail` });
  }
};

module.exports = { googleAuth, registergoogleAuth };
