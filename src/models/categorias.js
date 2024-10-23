const { DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  sequelize.define("categoria", {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false
  });
};