const axios = require("axios");

const leaguesCache = {}; // key: `${season}-${country}-${type}` => value: { leagues, defaultAppliedFilters }

const fetchLeagues = async (season = new Date().getFullYear(), country = "England", type = "league") => {
  const cacheKey = `${season}-${country}-${type}`;

  // ✅ Return from cache if available
  if (leaguesCache[cacheKey]) {
    return leaguesCache[cacheKey];
  }

  if (!process.env.API_FOOTBALL_URL || !process.env.API_FOOTBALL_KEY) {
    throw new Error("API_FOOTBALL_URL or API_FOOTBALL_KEY is not set in the .env file");
  }

  const paramsList = [
    { season, country, type },
    { season, country },
    { season },
    {},
  ];

  for (const params of paramsList) {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const url = `${process.env.API_FOOTBALL_URL}/leagues?${searchParams}`;

      const response = await axios.get(url, {
        headers: {
          "x-apisports-key": process.env.API_FOOTBALL_KEY,
        },
      });

      if (response.data && response.data.response && response.data.response.length > 0) {
        const leaguesMap = response.data.response.reduce((acc, leagueData) => {
          if (leagueData.league && leagueData.league.name && leagueData.league.id) {
            acc[leagueData.league.name.toLowerCase()] = leagueData.league.id;
          }
          return acc;
        }, {});

        const result = {
          leagues: leaguesMap,
          defaultAppliedFilters: params,
        };

        leaguesCache[cacheKey] = result;

        console.log("✅ Debug - Retorno final do fetchLeagues:");
        console.log(JSON.stringify(result, null, 2));

        return result;
      }
    } catch (error) {
      console.error("❌ Error fetching leagues:", error.message);
    }
  }

  console.error("⚠️ No leagues found after trying all filter variations.");
  return null;
};

// Loads default on startup (England, current year, league)
const loadLeagues = async () => {
  try {
    await fetchLeagues();
  } catch (err) {
    console.error("❌ Failed to load leagues on startup:", err.message);
  }
};

// Returns full cache object or filters it by params if needed
const getLeagues = (season = new Date().getFullYear(), country = "England", type = "league") => {
  const cacheKey = `${season}-${country}-${type}`;
  return leaguesCache[cacheKey] || null;
};

module.exports = { fetchLeagues, loadLeagues, getLeagues };
