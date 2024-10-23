const { Bitacora } = require('../db'); // Asegúrate de importar tu modelo de Bitacora

exports.getBitacora = async (req, res) => {
  try {
    const registros = await Bitacora.findAll();
    res.json(registros);
  } catch (error) {
    console.error('Error al obtener la bitácora:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};