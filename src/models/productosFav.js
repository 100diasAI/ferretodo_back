const { DataTypes, sequelize } = require("sequelize");
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define("productosFav", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    productId:{
      type: DataTypes.INTEGER,
      allowNull: false,
    }
   
  },{
    timestamps: false
});
};