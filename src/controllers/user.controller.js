const { Op } = require("sequelize");
const { Usuario } = require("../db.js");
const { emailRegistro, emailOlvidePassword } = require("../helpers/emails.js");
const { generarJWT } = require("../helpers/generarJWT.js");
const generarTokenID = require("../helpers/generarTokenID.js");
const { comparePassword, hashPassword } = require("../helpers/hashPassword.js");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  //Sacamos los datos necesarios del body del request
  const { nombre, apellido, telefono, mail, direccion, contraseña, dni } =
    req.body;

  //Si alguno no existe, mandamos un error
  if (!nombre || !apellido || !mail || !direccion || !contraseña)
    return res.status(400).json({ Error: "Faltan datos." });

  const userExists = await Usuario.findOne({
    where: { mail },
  });

  if (userExists) {
    const error = new Error(`El usuario con mail ${mail} ya existe`);
    return res.status(400).json({ msg: error.message });
  }

  //Creamos el usuario en la db
  try {
    const createUser = await Usuario.create({
      dni: dni ? dni : Math.round(Math.random() * 100),
      nombre: nombre,
      apellido: apellido,
      mail: mail,
      telefono: telefono && telefono,
      direccion: direccion,
      contraseña: await hashPassword(contraseña),
      token: generarTokenID(),
    });

    //Cuando lo creamos, almacenamos los valores de la promesa de su creacion en la db y lo mandamos
    const createdUser = createUser.dataValues;

    emailRegistro({
      email: createdUser.mail,
      name: createUser.nombre,
      token: createdUser.token,
    });

    return res.status(201).json({
      msg: "¡Cuenta creada exitosamente!",
      user: {
        nombre,
        apellido,
        isAdmin: createdUser.isAdmin,
        token: createdUser.token,
        confirmado: createdUser.confirmado,
      },
    });
    //Si pasa algo raro, mandamos un error y lo consologeamos
  } catch (e) {
    console.log(e);
    return res.status(400).send({ Error: e });
  }
};

const authentication = async (req, res) => {
  const { mail, contraseña } = req.body;

  const user = await Usuario.findOne({
    where: { mail },
  });

  if (!user) {
    const error = new Error("El usuario no existe");
    return res.status(400).json({ msg: error.message });
  }
  if (!user.confirmado) {
    const error = new Error("Usuario no confirmado por favor revise su correo");
    return res.status(400).json({ msg: error.message });
  }
  if(user.banned){
    const error = new Error("Ese usuario esta baneado.");
    return res.status(400).json({ msg: error.message });
  }

  if (await comparePassword(contraseña, user.contraseña)) {

    // req.session.userId = user.id; No me figuraba el userId cuando lo consologeaba así que lo cambié por un jwt

    const token = generarJWT(user.id)

    res.cookie('jwt', token)

    return res.status(200).json({
      id: user.id,
      name: user.nombre,
      email: user.mail,
      isAdmin: user.isAdmin,
      confirmado: user.confirmado,
      token: token,
      lastName: user.apellido,
      phone: user.telefono,
      address: user.direccion,
      dni: user.dni,
    });
  } else {
    const error = new Error("La contraseña es incorrecta");
    return res.status(400).json({ msg: error.message });
  }
};

const getUsers = async (req, res) => {


  try {
    const users = !req.query.search ? await Usuario.findAll() : await Usuario.findAll({where:{
      [Op.or]: [{nombre: {[Op.iLike]: `%${req.query.search}%`}}, {apellido: {[Op.iLike]: `%${req.query.search}%`}}]
    }})
    res.json(users);
  } catch (error) {
    console.log(error);
  }
};

const confirmarCuenta = async (req, res) => {
  try {
    const { token } = req.params;
    const usuarioConfirmar = await Usuario.findOne({
      where: { token },
    });

    if (!usuarioConfirmar) {
      const error = new Error("Token is not valid");
      return res.status(400).json({ error: error.message });
    }

    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = "";
    await usuarioConfirmar.save();

    return res.json({
      msg: "¡Usuario confirmado exitosamente!",
      user: { confirmado: usuarioConfirmar.confirmado },
    });
  } catch (error) {
    console.log(error);
  }
};

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const mail = email;
  const userExists = await Usuario.findOne({
    where: { mail },
  });

  if (!userExists) {
    const error = new Error(`El usuario con el mail ${mail} no existe`);
    return res.status(400).json({ msg: error.message });
  }

  try {
    userExists.token = generarTokenID();
    await userExists.save();

    emailOlvidePassword({
      email: userExists.mail,
      name: userExists.nombre,
      token: userExists.token,
    });

    return res.json({
      msg: `Hemos enviado un email a ${userExists.mail} con las instrucciones`,
    });
  } catch (error) {
    console.log(error);
  }
};


const salir = async (req, res) => {
  try {
    res.clearCookie('jwt')
    res.clearCookie('FOOD-API.sig')
    res.clearCookie('FOOD-API')
    req.session = null;
    res.status(200).send("donats!");
  } catch (error) {
    console.log(error);
  }
};

const comprobarToken = async (req, res) => {
  const { token } = req.params;

  const userToken = await Usuario.findOne({
    where: { token },
  });

  if (userToken) {
    res.json({ tokenValid: true, msg: "Token valido" });
  } else {
    const error = new Error("El token solicitado no es valido");
    return res.status(404).json({ msg: error.message });
  }
};

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  if (!password) {
    const error = new Error("Contraseña solicitada no ingresada");
    return res.status(400).json({ msg: error.message });
  }

  const user = await Usuario.findOne({
    where: { token },
  });

  if (user) {
    user.contraseña = await hashPassword(password);
    user.token = "";
    try {
      await user.save();
      return res.json({ msg: "Contraseña cambiada correctamente" });
    } catch (error) {
      console.log(error);
    }
  } else {
    const error = new Error("Token no valido");
    return res.status(404).json({ msg: error.message });
  }
};

const isAuthenticated = async (req, res, next) => {
    try {
        console.log("=== DEBUG AUTH MIDDLEWARE ===");
        console.log("Headers de autenticación:", req.headers.authorization);
        console.log("Cookies:", req.cookies);
        console.log("Session:", req.session);
        console.log("=== DEBUG AUTH MIDDLEWARE FIN ===");

        const decode = await promisify(jwt.verify)(
            req.cookies.jwt,
            process.env.JWT_SECRET
        );
        const { id } = decode;
        const user = await Usuario.findByPk(id);
        if(!user) return res.send({Error: "Usuario no encontrado."})
        if(user.banned) return res.send({Error: "Ese usuario está baneado."})
        next()
    } catch (error) {
        console.error("Error en middleware de autenticación:", error);
        return res.status(401).json({ error: "Error de autenticación" });
    }
};

const isAdmin = async (req, res, next) => {

  try{
  const decode = await promisify(jwt.verify)(
    req.cookies.jwt,
    process.env.JWT_SECRET
  );
  const { id } = decode;
  const user = await Usuario.findByPk(id);
  if(!user) return res.send({Error: "Usuario no encontrado."})
  if(user.banned) return res.send({Error: "Ese usuario está baneado."})
  if(!user.isAdmin) return res.send({Error: "No autorizado."})
  next()
  }catch(e){
    console.log(e)
    res.send(e)
  }
}

module.exports = {
  register,
  authentication,
  getUsers,
  confirmarCuenta,
  olvidePassword,
  comprobarToken,
  nuevoPassword, 
  salir,
  isAuthenticated,
  isAdmin
};