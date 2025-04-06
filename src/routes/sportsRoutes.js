require("dotenv").config();
const express = require("express");
const axios = require("axios");
//TO DO: Fazer as rotas e integrar com a lógica de cache
const router = express.Router();
const fetchLeagues = require("../services/leagueCacheService").fetchLeagues;

router.get("/soccer/results", async (req, res) => {
  try {
    const { league: leagueName, season} = req.query;

    if (!leagueName || !season) {
      return res.status(400).json({
        error: "Missing required query parameters: 'league' and 'season'.",
      });
    }

    
    const leaguesMap = await fetchLeagues(season);
    const leagueId = leaguesMap[leagueName.toLowerCase().trim()];

    if (!leagueId) {
      return res.status(400).json({
        error: "League not found. Please check the spelling or availability.",
        provided: leagueName,
      });
    }

    
    const queryParams = new URLSearchParams({
      season,
      league: leagueId,
    });

    const url = `${process.env.API_FOOTBALL_URL}/fixtures?${queryParams.toString()}`;

    const response = await axios.get(url, {
      headers: {
        "x-apisports-key": process.env.API_FOOTBALL_KEY,
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching soccer results:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
