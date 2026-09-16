const { Router } = require("express");
const router = Router();

const { obtenerRecaudacion} = require("../controllers/reportes.controller");


router.get("/recaudacion", obtenerRecaudacion);



module.exports = router;



