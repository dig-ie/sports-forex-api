require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const fetchLeagues = require("../services/leagueCacheService").fetchLeagues;
const { getLeagues } = require("../services/leagueCacheService").getLeagues;

router.get("/soccer/leagues", (req, res) => {
  const result = getLeagues();
  if (!result || !result.leagues) {
    return res.status(503).json({ error: "Leagues data not available yet" });
  }
  res.json(result);
});

router.get("/soccer/results", async (req, res) => {
  try {
    const { league: leagueName, season } = req.query;

    if (!leagueName || !season) {
      return res.status(400).json({
        error: "Missing required query parameters: 'league' and 'season'.",
      });
    }

    const { leagues: leaguesMap } = await fetchLeagues(season);

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




//TO DO: PLAYERS DATA ROUTES

module.exports = router;
