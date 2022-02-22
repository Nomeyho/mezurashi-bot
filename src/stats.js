const maps = require("../data/maps.json");
const { upgradeMezurashi, getMezurashi, getUserInfo, getArcadeMap } = require("./client");
const { simulate } = require('./simulator'); 
const { sleep } = require("./utils");
const { logger } = require("./logger");

const STATS = ["life", "force", "speed"];
const COEFF = {
  life: 0.9,
  force: 0.8,
  speed: 0.9,
  critical: 0.1,
};
const COST = 50;
const TO_WIN_THRESHOLD = 30;
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

module.exports.upgradeStats = async function (userInfo, mezurashi) {
  const nextMapStats = getNextMapStats(userInfo, mezurashi);

  for (const stat of STATS) {
    await upgradeStat(userInfo, mezurashi, stat, nextMapStats);
  }
};

module.exports.getMap = async function (userInfo, mezurashi) {
  for (let i = getLastMapIndex(userInfo, mezurashi); i >= 0; i--) {
    const map = await getArcadeMap(userInfo.account, i, mezurashi);
    await sleep(1000);

    if (map.toWin > TO_WIN_THRESHOLD) {
      return map;
    } else {
      logger.info(`Too low reward for map: ${map.name} (level=${map.level}, id=${map._id}, reward=${map.toWin}$)`);
    }
  }
  
  throw new Error('Could not find playable map');
};


function getNextMapStats(userInfo, mezurashi) {
  const lastMapIndex = getLastMapIndex(userInfo, mezurashi);

  if (lastMapIndex < userInfo.arcade) {
    // Use next map, if any
    return maps[lastMapIndex + 1];
  } else {
    // Reached the last map
    return maps[lastMapIndex];
  }
};

function getLastMapIndex(userInfo, mezurashi) {
  for (let i = userInfo.arcade; i >= 0; i--) {
    if (hasRequiredStats(mezurashi, maps[i])) {
      return i;
    }
  }
  return 0;
}

async function upgradeStat(userInfo, mezurashi, stat, nextMapStats) {
  if (mezurashi[stat] < nextMapStats[stat]) {
    logger.info(
      `${stat.capitalize()} required for next level: ${mezurashi[stat]}/${nextMapStats[stat]}`
    );
  }

  while (mezurashi[stat] < nextMapStats[stat]) {
    if (userInfo.mezuwar < COST) {
      logger.info(
        `Not enough money to upgrade '${stat}': ${userInfo.mezuwar}$`
      );
      return;
    }
    const result = await upgradeMezurashi(mezurashi.account, mezurashi._id, stat);
    logger.info(`Upgraded: ${UPGRADES[stat][result - 1]}`);

    await sleep(2000);
    await refreshMezurashi(mezurashi);
    await refreshUserInfo(userInfo, mezurashi);
  }
}

function hasRequiredStats(mezurashi, map) {
  return simulate(mezurashi, map) == 1;
  // TODO return STATS.every((stat) => mezurashi[stat] >= COEFF[stat] * map[stat]);
};

async function refreshMezurashi(mezurashi) {
  const updatedMezurashi = await getMezurashi(mezurashi.account, mezurashi._id);
  Object.assign(mezurashi, updatedMezurashi);
}

async function refreshUserInfo(userInfo, mezurashi) {
  const updatedUserInfo = await getUserInfo(userInfo.account, mezurashi);
  Object.assign(userInfo, updatedUserInfo);
}
