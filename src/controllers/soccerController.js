const { getSoccerResults } = require('../services/soccerService');

async function soccerResultsHandler(req, res) {
  try {
    const { league, season, country, type } = req.query;
    const results = await getSoccerResults({
      leagueName: league,
      season: season || new Date().getFullYear(),
      country: country || 'England',
      type: type || 'league',
    });
    res.json(results);
  } catch (err) {
    const msg = err.message || 'Internal server error';
    const status = msg.startsWith('Missing') || msg.startsWith('League not found') ? 400 : 500;
    res.status(status).json({ error: msg });
  }
}

module.exports = { soccerResultsHandler };