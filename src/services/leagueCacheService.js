// const dotenv = require("dotenv");
// const path = require("path");
// dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const axios = require("axios");

let leaguesCache = null;

const fetchLeagues = async (season = new Date().getFullYear(), country = "England", type = "league") => {
  if (leaguesCache) return leaguesCache;

  if (!process.env.API_FOOTBALL_URL || !process.env.API_FOOTBALL_KEY) {
    throw new Error("API_FOOTBALL_URL or API_FOOTBALL_KEY is not set in the .env file");
  }

  const paramsList = [
    { season, country, type },
    { season, country },    
    { season },      
    {}
  ];

  for (const params of paramsList) {
    try {
      const searchParams = new URLSearchParams(params).toString();
      const url = `${process.env.API_FOOTBALL_URL}/leagues?${searchParams}`;

      const response = await axios.get(url, {
        headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY },
      });

      if (response.data && response.data.response && response.data.response.length > 0) {
        leaguesCache = response.data.response.reduce((acc, leagueData) => {
          if (leagueData.league && leagueData.league.name && leagueData.league.id) {
            acc[leagueData.league.name.toLowerCase()] = leagueData.league.id;
          }
          return acc;
        }, {});

        const result = {
            leagues: leaguesCache,
            defaultAppliedFilters: params,
          };
          
          console.log("Debug - Retorno final do fetchLeagues:");
          console.log(JSON.stringify(result, null, 2));
          
          return result;
      }
    } catch (error) {
      console.error("Error fetching leagues:", error.message);
    }
  }

  console.error("No leagues found after trying all filter variations.");
  return null;
};

// fetchLeagues()

module.exports = { fetchLeagues };
