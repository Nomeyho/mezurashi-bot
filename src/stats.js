const { upgradeMezurashi, getMezurashi, getUserInfo } = require("./client");
const { sleep } = require("./utils");

const STATS = ["life", "force", "speed", "critical"];
const COST = 50;
const COEFF = {
  life: 0.7,
  force: 0.9,
  speed: 0.9,
  critical: 0.5,
};

module.exports.upgradeStats = async function (userInfo, mezurashi, map) {
  for (const stat of STATS) {
    await upgradeStat(userInfo, stat, mezurashi, COEFF[stat] * map[stat]);
  }
};

module.exports.hasRequiredStats = function (mezurashi, map) {
  return STATS.every((stat) => hasRequiredStat(mezurashi, map, stat));
};

async function upgradeStat(userInfo, stat, mezurashi, requiredStat) {
  console.log(`Next map requires: ${mezurashi[stat]}/${requiredStat} ${stat}`);

  while (userInfo.mezuwar >= COST && mezurashi[stat] < requiredStat) {
    await doUpgradeStat(userInfo, mezurashi, stat);
  }

  console.log(`No more money to upgrade '${stat}': ${userInfo.mezuwar}$`);
}

async function doUpgradeStat(userInfo, mezurashi, stat) {
  await upgradeMezurashi(mezurashi.account, mezurashi._id, stat);
  await sleep(2000);
  await refreshMezurashi(mezurashi);
  await refreshUserInfo(userInfo);

  console.log(
    `Upgraded: life=${mezurashi.life}, force=${mezurashi.force}, speed=${mezurashi.speed}, critical=${mezurashi.critical}`
  );
}

function hasRequiredStat(mezurashi, map, stat) {
  return mezurashi[stat] >= COEFF[stat] * map[stat];
}

async function refreshMezurashi(mezurashi) {
  const updatedMezurashi = await getMezurashi(mezurashi.account, mezurashi._id);
  Object.assign(mezurashi, updatedMezurashi);
}

async function refreshUserInfo(userInfo) {
  const updatedUserInfo = await getUserInfo(userInfo.account);
  Object.assign(userInfo, updatedUserInfo);
}
