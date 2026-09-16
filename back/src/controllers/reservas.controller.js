const { getConnection } = require("../config/db");
const sql = require("mssql");

async function obtenerReservas(req, res) {
  try {
    const pool = await getConnection();
    const resultado = await pool.request().execute("usp_ListarReservas");
    res.json(resultado.recordset); 
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener las reservas", error: error.message });
  }
}

async function CrearReservas(req, res) {
    const { IdCancha, Cliente, Fecha, Hora } = req.body;

    try {
        const pool = await getConnection();

        await pool.request()
            .input("IdCancha", sql.Int, parseInt(IdCancha, 10))
            .input("Cliente", sql.NVarChar(100), Cliente)
            .input("Fecha", sql.Date, Fecha)
            .input("Hora", sql.NVarChar(5), Hora)
            .execute("usp_CrearReserva");

        res.json({ mensaje: "Reserva creada exitosamente" });
    } catch (error) {
        res.status(400).json({ 
            mensaje: error.message || "Error al registrar la reserva" 
        });
    }
}

async function RegistrarPago(req, res) {
    const { id } = req.params; 

    try {
        const pool = await getConnection();

        await pool.request()
            .input("IdReserva", sql.Int, parseInt(id, 10))
            .execute("usp_RegistrarPago");

        res.json({ mensaje: "Pago registrado exitosamente" });
    } catch (error) {
        res.status(400).json({ 
            mensaje: error.message || "Error al registrar el pago" 
        });
    }
}

module.exports = {
    obtenerReservas,
    CrearReservas,
    RegistrarPago
};