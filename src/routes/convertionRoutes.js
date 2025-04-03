const express = require("express");
const router = express.Router();

router.get("/simulacao", (req, res) => {
  const { from, to, amount } = req.query;
  if (!from || !to || !amount) {
    return res.status(400).json({ error: "Parâmetros inválidos" });
  }
  const converted = amount * 5.2; // Simulação
  res.json({ from, to, amount, converted });
});

module.exports = router;
