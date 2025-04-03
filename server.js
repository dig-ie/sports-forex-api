require("dotenv").config();
const express = require("express");
const cors = require("cors");
const convertRoutes = require("./src/routes/convertionRoutes");

const app = express();
app.use(cors());
app.use(express.json()); // Habilita JSON no body das requisições

// Rota de teste
app.get("/", (req, res) => {
  res.json({ message: "API funcionando! 🚀" });
});

app.use("/convert", convertRoutes);


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🔥 Servidor rodando na porta ${PORT}`));
