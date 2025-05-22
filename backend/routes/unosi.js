const express = require('express');
const router = express.Router();
const unosController = require('../controllers/unosiController');

router.get('/', unosController.getSviUnosi);
router.get('/:id', unosController.getJedanUnos);
router.post('/', unosController.kreirajUnos);
router.put('/:id', unosController.azurirajUnos);
router.delete('/:id', unosController.obrisiUnos);

module.exports = router;