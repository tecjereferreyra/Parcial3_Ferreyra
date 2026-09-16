const { Router } = require("express");
const router = Router();

const { obtenerCanchas} = require("../controllers/canchas.controller");


router.get("/", obtenerCanchas);


module.exports = router;


