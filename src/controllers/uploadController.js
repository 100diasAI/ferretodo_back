const { v2: cloudinary } = require('cloudinary');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: 'dhifgbexu',
  api_key: '726763815386677',
  api_secret: 'FH2fvr5jhiOsUm0y4fIB6dZcgJc'
});

const uploadImage = async (req, res) => {
  try {
    if (!req.files || !req.files.imagen) {
      return res.status(400).json({ error: 'No se ha proporcionado ninguna imagen' });
    }

    const file = req.files.imagen;
    
    // Subir a Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'productos',
      resource_type: 'auto'
    });

    res.json({ 
      success: true,
      imageUrl: result.secure_url 
    });

  } catch (error) {
    console.error('Error al subir imagen:', error);
    res.status(500).json({ 
      error: 'Error al subir la imagen',
      details: error.message 
    });
  }
};

module.exports = {
  uploadImage
};
