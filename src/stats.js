const { upgradeMezurashi, getMezurashi, getUserInfo } = require("./client");
const { sleep } = require("./utils");
const { logger } = require("./logger");

const STATS = ["life", "force", "speed", "critical"];
const COST = 50;
const COEFF = {
  life: 0.95,
  force: 0.9,
  speed: 0.9,
  critical: 0.1,
};
const UPGRADES = {
  life: [
    "try again",
    "+5 life",
    "+10 life",
    "loose",
    "+8 life",
    "+10 life (special)",
  ],
  force: [
    "try again",
    "+1 force",
    "+3 force",
    "loose",
    "+2 force",
    "+3 force (special)",
  ],
  speed: [
    "try again",
    "+2 speed",
    "+5 speed",
    "loose",
    "+3 speed",
    "+5 speed (special)",
  ],
  critical: [
    "try again",
    "+0.01% critical",
    "+0.03% critical",
    "loose",
    "+0.02% critical",
    "+0.03% critical (special)",
  ],
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
  if (mezurashi[stat] < requiredStat) {
    logger.info(
      `${stat.capitalize()} required for next level: ${
        mezurashi[stat]
      }/${requiredStat}`
    );
  }

  while (mezurashi[stat] < requiredStat) {
    if (userInfo.mezuwar < COST) {
      logger.info(
        `Not enough money to upgrade '${stat}': ${userInfo.mezuwar}$`
      );
      return;
    }
    await doUpgradeStat(userInfo, mezurashi, stat);
  }
}

async function doUpgradeStat(userInfo, mezurashi, stat) {
  const result = await upgradeMezurashi(mezurashi.account, mezurashi._id, stat);
  logger.info(`Upgraded: ${UPGRADES[stat][result - 1]}`);

  await sleep(2000);
  await refreshMezurashi(mezurashi);
  await refreshUserInfo(userInfo, mezurashi);
}

function hasRequiredStat(mezurashi, map, stat) {
  return mezurashi[stat] >= COEFF[stat] * map[stat];
}

async function refreshMezurashi(mezurashi) {
  const updatedMezurashi = await getMezurashi(mezurashi.account, mezurashi._id);
  Object.assign(mezurashi, updatedMezurashi);
}

async function refreshUserInfo(userInfo, mezurashi) {
  const updatedUserInfo = await getUserInfo(userInfo.account, mezurashi);
  Object.assign(userInfo, updatedUserInfo);
}
