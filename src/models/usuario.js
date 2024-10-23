const { DataTypes, sequelize, Sequelize } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "usuario",
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
      },
      imagen: {
        type: DataTypes.STRING,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      apellido: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      telefono: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      mail: {
        type: DataTypes.STRING,
        // allowNull: false,
        unique: true,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dni: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      contraseña: {
        type: DataTypes.STRING,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      bloqueado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      confirmado: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      token: {
        type: DataTypes.STRING,
      },
      carrito: {
        type: DataTypes.ARRAY(DataTypes.JSON),
      },
      banned: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    {
      timestamps: false,
    }
  );
};
