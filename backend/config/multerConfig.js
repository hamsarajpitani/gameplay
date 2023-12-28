const multer = require('multer');

const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
}).single('csvFile');

module.exports = { upload };
