const express = require('express');
const csvRoutes = require('./csvRoutes');

const router = express.Router();

router.use('/csv', csvRoutes);

module.exports = router;
