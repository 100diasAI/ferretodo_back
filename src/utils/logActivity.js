const { Bitacora } = require('../db');

async function logActivity(usuarioId, accion, detalles, ip) {
  try {
    const { fechaHoraInicio, fechaHoraFin, tiempoSesion, cantidadClics, ...otrosDetalles } = detalles;

    await Bitacora.create({
      usuarioId,
      accion,
      detalles: otrosDetalles,
      ip,
      fechaHoraInicio: fechaHoraInicio || new Date(),
      fechaHoraFin,
      tiempoSesion,
      cantidadClics,
    });
    console.log('Actividad registrada en bitácora');
  } catch (error) {
    console.error('Error al registrar actividad en bitácora:', error);
  }
}

module.exports = logActivity;
