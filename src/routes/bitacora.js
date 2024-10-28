const express = require('express');
const router = express.Router();
const { Bitacora } = require('../db');

router.get('/', async (req, res) => {
  try {
    const registros = await Bitacora.findAll({
      order: [['fechaHoraInicio', 'DESC']],
      limit: 100
    });
    console.log('Registros obtenidos:', registros.length);
    res.json({ registros });
  } catch (error) {
    console.error("Error al obtener registros de bitácora:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post('/', async (req, res) => {
  const { usuarioId, accion, detalles } = req.body;
  console.log('Recibida solicitud para registrar actividad:', { usuarioId, accion, detalles });
  
  // Obtener la IP real del cliente
  const ip = req.headers['x-forwarded-for'] || 
             req.headers['x-real-ip'] || 
             req.connection.remoteAddress || 
             req.socket.remoteAddress;
             
  try {
    const nuevoRegistro = await Bitacora.create({
      usuarioId,
      accion,
      detalles,
      ip: ip,  // Usar la IP obtenida
      fechaHoraInicio: new Date(),
    });
    console.log('Actividad registrada con éxito:', nuevoRegistro);
    res.status(200).json({ message: 'Actividad registrada', registro: nuevoRegistro });
  } catch (error) {
    console.error('Error al registrar actividad:', error);
    res.status(500).json({ error: 'Error al registrar actividad' });
  }
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const registro = await Bitacora.findByPk(id);
    if (registro) {
      await registro.update(updates);
      res.status(200).json({ message: 'Actividad actualizada', registro });
    } else {
      res.status(404).json({ error: 'Registro no encontrado' });
    }
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    res.status(500).json({ error: 'Error al actualizar actividad' });
  }
});

module.exports = router;
