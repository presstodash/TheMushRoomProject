const express = require("express");
const router = express.Router();
const controller = require("../controllers/lokacijeController");
const verifyToken = require("../middleware/authMiddleware");

router.get("/", controller.getSveLokacije);
router.post("/", verifyToken, controller.dodajLokaciju);

module.exports = router;