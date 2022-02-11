const Axios = require("axios");
const API_URL = "https://api.mezukotai.com";
const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0',
  'Accept': 'application/json',
  'Accept-Language': 'en-US,en;q=0.5',
  'Accept-Encoding': 'gzip, deflate, br',
  'Referer': 'https://game.mezukotai.com/',
  'Origin': 'https://game.mezukotai.com',
  'Connection': 'keep-alive',
  'Sec-Fetch-Dest': 'empty',
  'Sec-Fetch-Mode': 'cors',
  'Sec-Fetch-Site': 'cross-site',
}

module.exports.getUserInfo = async function (account) {
  return await get(account, "/v1/users/info");
};

module.exports.getMezurashis = async function (account) {
  return await get(account, '/v1/users/mezurashi');
}

module.exports.getMezurashi = async function (account, mezurashiId) {
  return await get(account, `/v1/users/mezurashi/${mezurashiId}`);
}

module.exports.getArcadeMap = async function (account, level) {
    return await get(account, `/v1/arcade/${level}`);
}

module.exports.getHistoryMaps = async function (account) {
    return await get(account, `/v1/map`);
}

module.exports.upgradeMezurashi = async function (account, mezurashiId, stat) {
  return await post(account, `/v1/users/mezurashi/${mezurashiId}/upgrade/${stat}`, '');
}

async function get(account, path) {
  return Axios.get(`${API_URL}${path}`, {
    headers: {
      ...HEADERS,
      account,
    },
  }).then((r) => r.data);
}

async function post(account, path, body) {
  return Axios.post(`${API_URL}${path}`, body, {
    headers: {
      ...HEADERS,
      account,
    },
  }).then((r) => r.data);
}
