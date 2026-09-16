const { Router } = require("express");
const router = Router();

const { obtenerReservas, CrearReservas, RegistrarPago} = require("../controllers/reservas.controller");


router.get("/", obtenerReservas);
router.post("/", CrearReservas);
router.put("/:id/pago", RegistrarPago);


module.exports = router;



