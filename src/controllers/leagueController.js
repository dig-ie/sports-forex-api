const { fetchLeagues, getCacheLeagues } = require('../services/leagueCacheService');

async function leaguesHandler(req, res) {
  try {
    const {
      season = new Date().getFullYear(),
      country = 'England',
      type = 'league',
    } = req.query;

    let result = getCacheLeagues(season, country, type);

    if (!result || !result.leagues) {
        console.log("League(s) not found in cache. Fetching from API...");
      result = await fetchLeagues(season, country, type);
    }

    if (!result || !result.leagues) {
      return res.status(503).json({ error: 'Leagues data not available.' });
    }

    res.json(result);
  } catch (err) {
    console.error('Error in /soccer/leagues:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}

module.exports = { leaguesHandler };