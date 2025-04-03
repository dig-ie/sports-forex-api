const axios = require("axios");

let leaguesCache = null;

const fetchLeagues = async () => {
  if (leaguesCache) return leaguesCache;

  try {
    // Verifica se as variáveis de ambiente estão configuradas corretamente
    if (!process.env.API_FOOTBALL_URL || !process.env.API_FOOTBALL_KEY) {
      throw new Error("API_FOOTBALL_URL ou API_FOOTBALL_KEY não foram configurados no .env");
    }

    const response = await axios.get(`${process.env.API_FOOTBALL_URL}/leagues`, {
      headers: { "x-apisports-key": process.env.API_FOOTBALL_KEY },
    });

    if (!response.data || !response.data.response) {
      throw new Error("Resposta da API de ligas inválida");
    }

    leaguesCache = response.data.response.reduce((acc, leagueData) => {
      if (leagueData.league && leagueData.league.name && leagueData.league.id) {
        acc[leagueData.league.name.toLowerCase()] = leagueData.league.id;
      }
      return acc;
    }, {});

    return leaguesCache;
  } catch (error) {
    console.error("Erro ao buscar ligas:", error.message);
    return null;
  }
};

module.exports = { fetchLeagues };
