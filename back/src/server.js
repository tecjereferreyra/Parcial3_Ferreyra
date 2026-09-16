const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const canchasRoutes = require("./routes/canchas.routes");
const reportesRoutes = require("./routes/reportes.routes");
const reservasRoutes = require("./routes/reservas.routes");

const app = express();

app.use(cors());          
app.use(express.json());  


app.use("/api/canchas", canchasRoutes);
app.use("/api/reportes", reportesRoutes);
app.use("/api/reservas", reservasRoutes);


app.get("/", (req, res) => {
  res.send("API El Rebote funcionando");
});

const PORT = process.env.PORT || 5500;

app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en puerto ${PORT}`);
});