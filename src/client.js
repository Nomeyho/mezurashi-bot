const Axios = require("axios");
const API_URL = "https://api.mezukotai.com";

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
      account,
    },
  }).then((r) => r.data);
}

async function post(account, path, body) {
  return Axios.post(`${API_URL}${path}`, body, {
    headers: {
      account,
    },
  }).then((r) => r.data);
}
