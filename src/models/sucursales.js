const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    // defino el modelo
    sequelize.define("sucursales", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
      },
      cp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      capital: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      coordenadas: {
        type: DataTypes.ARRAY(DataTypes.FLOAT),
        allowNull: false,
      },
    },{
      timestamps: false
  });
  };