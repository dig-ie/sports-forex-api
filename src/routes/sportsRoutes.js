require("dotenv").config();
const express = require("express");
const axios = require("axios");
//TO DO: Fazer as rotas e integrar com a lógica de cache
const router = express.Router();

// Get last 10 soccer match results
router.get("/soccer/results", async (req, res) => {
  try {
    const response = await axios.get(`${process.env.API_FOOTBALL_URL}/fixtures?season=2023&league=39`, {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY,
      },
    });

    // Send API data back to the client
    res.json(response.data);
  } catch (error) {
    console.error("Error fetching soccer results:", error);
    res.status(500).json({ error: "Failed to fetch soccer results" });
  }
});

module.exports = router;
