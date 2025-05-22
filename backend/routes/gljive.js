const express = require('express');
const router = express.Router();
const { getSveGljive } = require('../controllers/gljiveController');

router.get('/', getSveGljive);

module.exports = router;