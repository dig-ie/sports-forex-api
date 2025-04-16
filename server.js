require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./src/docs/swaggerConfig");
const convertRoutes = require("./src/routes/convertionRoutes");
const sportsRoutes = require("./src/routes/sportsRoutes");

const app = express();
app.use(cors());
app.use(express.json());

/**
 * @swagger
 * /ping:
 *   get:
 *     summary: Retorna pong
 *     tags: [Status]
 *     responses:
 *       200:
 *         description: Retorno com pong
 */
app.get("/ping", (req, res) => {
  res.json({ message: "Pong! API funcionando! 🚀" });
});

app.use("/convert", convertRoutes);

app.use("/sports", sportsRoutes);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🔥 Servidor rodando na porta ${PORT}`);
  console.log(`🌐 Acesse: http://localhost:${PORT}/api-docs`);
});
