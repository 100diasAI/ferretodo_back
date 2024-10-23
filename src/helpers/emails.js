const nodemailer = require("nodemailer");

const emailRegistro = async (data) => {
//   console.log(`Data`, data);
  const { name, email, token } = data;

  const transport = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: "henrypfg11@gmail.com",
      pass: "chirxatvtficaopa",
    },
  });

  const info = await transport.sendMail({
    from: "FerreTodo - E-commerce",
    to: email,
    subject: "FerreTodo - Comprueba tu cuenta",
    text: "Comprueba tu cuenta en FerreTodo",
    html: `<p>Hola : ${name}, Comprueba tu cuenta de FerreTodo</p>
    <p>Tu cuenta ya esta casi lista, solo debes confirmarla en el siguiente enlace: 
        <a href="http://localhost:3000/confirmar/${token}">Confirmar cuenta</a>
    </p>
    `,
  });
};

const emailOlvidePassword = async (data) => {
  //   console.log(`Data`, data);
    const { name, email, token } = data;
  
    const transport = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "henrypfg11@gmail.com",
        pass: "chirxatvtficaopa",
      },
    });
  
    const info = await transport.sendMail({
      from: "FerreTodo - E-commerce",
      to: email,
      subject: "FerreTodo - Reestablece tu Password",
      text: "Comprueba tu cuenta en Meli-Ropa",
      html: `<p>Hola : ${name}, has solicitado reestablecer tu password en FerreTodo</p>
      <p> Sigue el siguiente enlace para generar un nuevo password: 
          <a href="http://localhost:3000/olvide-password/${token}">Reestablecer Password</a>
      </p>
      `,
    });
  };

module.exports = { emailRegistro, emailOlvidePassword };
