const { getConnection } = require("../config/db");

async function obtenerCanchas(req, res) {
    try {
        const pool = await getConnection();
        const resultado = await pool.request().execute("usp_ListarCanchas");
        res.json(resultado.recordset);
    } catch (error) {
        res.status(500).json({ mensaje: "Error al obtener las canchas", error: error.message });
    }
}


module.exports = {
    obtenerCanchas
};


