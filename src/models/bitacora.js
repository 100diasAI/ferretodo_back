const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  sequelize.define('bitacora', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    usuarioId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    accion: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detalles: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    ip: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    fechaHoraInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaHoraFin: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    tiempoSesion: {
      type: DataTypes.INTEGER,  // en segundos
      allowNull: true,
    },
    cantidadClics: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  });
};
