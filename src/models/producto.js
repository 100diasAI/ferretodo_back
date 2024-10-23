const { DataTypes } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define(
    "producto",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      descripcion: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      subcategoria: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      marca: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      urlimagen: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 20,
      }
    },
    {
      timestamps: false,
    }
  );
};
