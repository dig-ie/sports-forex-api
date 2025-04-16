const axios = require('axios');
const { fetchLeagues } = require('./leagueCacheService');

/**
 * Busca e transforma resultados de partidas de futebol.
 * @param {Object} options
 * @param {string} options.leagueName
 * @param {number|string} options.season
 * @param {string} options.country
 * @param {string} options.type
 * @returns {Promise<Array>}
 */
async function getSoccerResults({ leagueName, season, country = 'England', type = 'league' }) {
  if (!leagueName) throw new Error("Missing required parameter: 'league'.");

  // Resolve ID: aceita ID numérico ou nome
  let leagueId = parseInt(leagueName, 10);
  if (isNaN(leagueId)) {
    const { leagues: leaguesMap } = await fetchLeagues(season, country, type);
    leagueId = leaguesMap[leagueName.toLowerCase().trim()];
  }
  if (!leagueId) throw new Error(`League not found: ${leagueName}`);

  // Monta URL para fixtures
  const params = new URLSearchParams({ season, league: leagueId }).toString();
  const url = `${process.env.API_FOOTBALL_URL}/fixtures?${params}`;

  const response = await axios.get(url, {
    headers: { 'x-apisports-key': process.env.API_FOOTBALL_KEY }
  });

  return response.data.response.map(match => ({
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
    source: 'API-Football',
    last_updated: new Date().toISOString(),
  }));
}

module.exports = { getSoccerResults };
