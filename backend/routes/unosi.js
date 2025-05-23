const express = require('express');
const router = express.Router();
const unosiController = require('../controllers/unosiController');

const verifyToken = require('../middleware/authMiddleware');
router.get('/', verifyToken, unosiController.getSviUnosi);
router.get('/:id', verifyToken,unosiController.getJedanUnos);
router.post('/', verifyToken, unosiController.kreirajUnos);
router.put('/:id', verifyToken, unosiController.azurirajUnos);
router.delete('/:id', verifyToken, unosiController.obrisiUnos);

module.exports = router;