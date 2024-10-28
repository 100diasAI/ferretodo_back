const express = require('express');
const router = express.Router();
const fileUpload = require('express-fileupload');
const { uploadImage } = require('../controllers/uploadController');

router.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/'
}));

router.post('/', uploadImage);

module.exports = router;
