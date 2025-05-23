const express = require('express');
const router = express.Router();
const unosiController = require('../controllers/unosiController');

const verifyToken = require('../middleware/authMiddleware');
router.get('/', verifyToken, unosiController.getSviUnosi);
router.get('/:id', verifyToken,unosiController.getJedanUnos);
router.post('/', verifyToken, unosiController.createUnos);
router.put('/:id', verifyToken, unosiController.updateUnos);
router.delete('/:id', verifyToken, unosiController.deleteUnos);

module.exports = router;