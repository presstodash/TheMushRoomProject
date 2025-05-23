const express = require('express');
const router = express.Router();
const kategorijeController = require('../controllers/kategorijeController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', kategorijeController.getKategorije);
router.post('/', authMiddleware, kategorijeController.createKategorija);
router.put('/:id', authMiddleware, kategorijeController.updateKategorija);
router.delete('/:id', authMiddleware, kategorijeController.deleteKategorija);

module.exports = router;