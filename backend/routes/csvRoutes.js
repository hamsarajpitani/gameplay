const express = require('express');

const { upload } = require('../config/multerConfig');
const {
  validateCSV,
  processCSV,
  removeCsvRecord,
} = require('../controller/csvController');

const router = express.Router();

router.post('/validate-csv', upload, validateCSV);
router.get('/process-csv/:uuid', processCSV);
router.get('/remove-csv/:uuid', removeCsvRecord);

module.exports = router;
