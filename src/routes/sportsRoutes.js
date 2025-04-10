require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const { fetchLeagues, getLeagues } = require("../services/leagueCacheService");

/**
 * @swagger
 * /sports/soccer/leagues:
 *   get:
 *     summary: Retorna ligas em cache
 *     tags: [Futebol]
 *     parameters:
 *       - in: query
 *         name: season
 *         required: false
 *         schema:
 *           type: string
 *         description: "Temporada desejada exemplo 2024"
 *       - in: query
 *         name: country
 *         required: false
 *         schema:
 *           type: string
 *         description: "País da liga exemplo England"
 *       - in: query
 *         name: type
 *         required: false
 *         schema:
 *           type: string
 *         description: "Tipo de competição exemplo league)"
 *     responses:
 *       200:
 *         description: Lista de ligas em cache
 */
router.get("/soccer/leagues", async (req, res) => {
  try {
    const {
      season = new Date().getFullYear(),
      country = "England",
      type = "league",
    } = req.query;

    let result = getLeagues(season, country, type);

    if (!result || !result.leagues) {
      result = await fetchLeagues(season, country, type);
    }

    if (!result || !result.leagues) {
      return res.status(503).json({ error: "Leagues data not available." });
    }

    res.json(result);
  } catch (err) {
    console.error("Error in /soccer/leagues:", err.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /sports/soccer/results:
 *   get:
 *     summary: Retorna os resultados dos jogos de uma liga específica
 *     tags: [Esportes]
 *     parameters:
 *       - in: query
 *         name: league
 *         required: true
 *         schema:
 *           type: string
 *         description: "Nome da liga, exemplo: Premier League"
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         description: "Temporada desejada, exemplo: 2024"
 *       - in: query
 *         name: country
 *         schema:
 *           type: string
 *         description: "País da liga (ex: England)"
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *         description: "Tipo de competição (ex: league)"
 *     responses:
 *       200:
 *         description: Resultados retornados com sucesso
 *       400:
 *         description: Parâmetro ausente ou liga inválida
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/soccer/results", async (req, res) => {
  try {
    const {
      league: leagueName,
      season = new Date().getFullYear(),
      country = "England",
      type = "league",
    } = req.query;

    if (!leagueName) {
      return res.status(400).json({
        error: "Missing required query parameter: 'league'.",
      });
    }

    const { leagues: leaguesMap } = await fetchLeagues(season, country, type);
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
