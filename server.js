require("dotenv").config();
const express = require("express");
const cors = require("cors");
const convertRoutes = require("./src/routes/convertionRoutes");
const sportsRoutes = require("./src/routes/sportsRoutes");

const app = express();
app.use(cors());
app.use(express.json()); // Habilita JSON no body das requisições

// Rota de teste
app.get("/ping", (req, res) => {
  res.json({ message: "Pong! API funcionando! 🚀" });
});

app.use("/convert", convertRoutes);

app.use("/sports", sportsRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
