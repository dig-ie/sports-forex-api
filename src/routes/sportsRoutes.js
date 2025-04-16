require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const { fetchLeagues, getLeagues } = require("../services/leagueCacheService");
//TO DO: Minimizar retorno de results

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

    const transformedData = response.data.response.map((match) => ({
      match_id: match.fixture.id,
      date: match.fixture.date,
      status: match.fixture.status.short,
      league: match.league.name,
      season: match.league.season,
      round: match.league.round,
      venue: match.fixture.venue.name,
      city: match.fixture.venue.city,
      home_team: {
        name: match.teams.home.name,
        goals: match.goals.home,
        winner: match.teams.home.winner,
      },
      away_team: {
        name: match.teams.away.name,
        goals: match.goals.away,
        winner: match.teams.away.winner,
      },
      halftime_score: {
        home: match.score.halftime.home,
        away: match.score.halftime.away,
      },
      fulltime_score: {
        home: match.score.fulltime.home,
        away: match.score.fulltime.away,
      },
      source: "API-Football",
      last_updated: new Date().toISOString(),
    }));

    res.json(transformedData);
  } catch (error) {
    console.error("Error fetching soccer results:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /sports/soccer/odds:
 *   get:
 *     summary: Retorna odds pré-jogo com base em filtros
 *     tags: [Odds]
 *     parameters:
 *       - in: query
 *         name: league
 *         schema:
 *           type: string
 *         description: "Nome da liga (Premier League) ou ID da liga (ex: 39)"
 *       - in: query
 *         name: season
 *         schema:
 *           type: string
 *         description: "Temporada (ex: 2024, default é o ano atual)"
 *       - in: query
 *         name: date
 *         schema:
 *           type: string
 *         description: Data do jogo no formato YYYY-MM-DD
 *     responses:
 *       200:
 *         description: Odds pré-jogo retornadas com sucesso
 */
router.get("/soccer/odds", async (req, res) => {
  try {
    const {
      league: leagueInput,
      season = new Date().getFullYear(),
      date,
    } = req.query;

    let leagueId = parseInt(leagueInput);
    if (isNaN(leagueId)) {
      const { leagues: leaguesMap } = await fetchLeagues(season);
      leagueId = leaguesMap[leagueInput?.toLowerCase().trim()];
    }

    if (!leagueId) {
      return res.status(400).json({
        error: "League ID or name not found. Verifique o valor passado.",
        provided: leagueInput,
      });
    }

    const queryParams = new URLSearchParams({
      league: leagueId,
      season,
    });
    if (date) queryParams.append("date", date);

    const url = `${process.env.API_FOOTBALL_URL}/odds?${queryParams.toString()}`;
    const response = await axios.get(url, {
      headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar odds pré-jogo:", err.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

/**
 * @swagger
 * /sports/soccer/odds/live:
 *   get:
 *     summary: Retorna odds em tempo real dos jogos em andamento
 *     tags: [Odds]
 *     responses:
 *       200:
 *         description: Odds em tempo real retornadas com sucesso
 */
router.get("/soccer/odds/live", async (_req, res) => {
  try {
    const url = `${process.env.API_FOOTBALL_URL}/odds/live`;
    const response = await axios.get(url, {
      headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY },
    });

    res.json(response.data);
  } catch (err) {
    console.error("Erro ao buscar odds ao vivo:", err.message);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});



module.exports = router;
