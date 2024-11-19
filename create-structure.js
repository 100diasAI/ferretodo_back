const fs = require('fs');
const path = require('path');

// Define la estructura de carpetas y archivos
const structure = {
  'src/app/features/manage-medical-record': {
    'components': {
      'medical-record-form': [
        'medical-record-form.component.ts',
        'medical-record-form.component.html',
        'medical-record-form.component.scss'
      ],
      'medical-record-list': [
        'medical-record-list.component.ts',
        'medical-record-list.component.html',
        'medical-record-list.component.scss'
      ],
      'edit-medical-record': [
        'edit-medical-record.component.ts',
        'edit-medical-record.component.html',
        'edit-medical-record.component.scss'
      ]
    },
    'pages': {
      'manage-medical-record-page': [
        'manage-medical-record-page.component.ts',
        'manage-medical-record-page.component.html',
        'manage-medical-record-page.component.scss'
      ]
    },
    'services': [
      'medical-record.service.ts'
    ],
    'models': [
      'medical-record.model.ts'
    ],
    'routes': [
      'manage-medical-record.routes.ts'
    ]
  }
};


// Función para crear carpetas y archivos
const createStructure = (basePath, obj) => {
  for (const key in obj) {
    const currentPath = path.join(basePath, key);
    if (Array.isArray(obj[key])) {
      // Crear la carpeta si no existe
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      // Crear los archivos dentro de la carpeta
      obj[key].forEach(file => {
        const filePath = path.join(currentPath, file);
        if (!fs.existsSync(filePath)) {
          fs.writeFileSync(filePath, '', 'utf8'); // Crear archivo vacío
        }
      });
    } else {
      // Crear carpeta y procesar recursivamente
      if (!fs.existsSync(currentPath)) {
        fs.mkdirSync(currentPath, { recursive: true });
      }
      createStructure(currentPath, obj[key]);
    }
  }
};

// Ejecutar el script
const basePath = __dirname; // Cambia si necesitas otro directorio base
createStructure(basePath, structure);

console.log('Estructura creada exitosamente.');
