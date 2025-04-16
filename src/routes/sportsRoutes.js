require("dotenv").config();
const express = require("express");
const axios = require("axios");
const router = express.Router();
const { leaguesHandler } = require("../controllers/leagueController");
const { soccerResultsHandler } = require("../controllers/soccerController")


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
router.get("/soccer/leagues", leaguesHandler);

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
router.get("/soccer/results", soccerResultsHandler);


module.exports = router;
