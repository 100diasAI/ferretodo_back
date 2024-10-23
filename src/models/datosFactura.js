const { DataTypes, sequelize, Sequelize } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "datosFactura",
    {
      id: {
        type: DataTypes.STRING,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
        allowNull: false,
      },
      direccion: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dni: {
        type: DataTypes.BIGINT,
        allowNull: false,
      },
      montoTotal: {
        type: DataTypes.INTEGER
      },
    },
    {
      timestamps: false,
    }
  );
};
