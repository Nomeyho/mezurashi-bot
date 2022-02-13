const maps = require("../data/maps.json");
const { getArcadeMap } = require('./client');
const { hasRequiredStats } = require("./stats");
const { logger } = require("./logger");

module.exports.getNextMap = async function (userInfo, mezurashi) {
  const nextMapIndex = getNextMapIndex(userInfo, mezurashi);

  if (nextMapIndex < userInfo.arcade) {
    // Use next map, if any
    return maps[nextMapIndex + 1];
  } else {
    // Reached the last map
    return maps[nextMapIndex];
  }
};

function getNextMapIndex(userInfo, mezurashi) {
  for (let i = userInfo.arcade; i >= 0; i--) {
    if (hasRequiredStats(mezurashi, maps[i])) {
      logger.debug(
        `Found matching map: index=${i}, id=${maps[i]._id}, name=${maps[i].name}`
      );
      return i;
    }
  }

  return 0;
}

module.exports.selectMap = async function (userInfo, mezurashi, nextMap) {
    if (hasRequiredStats(mezurashi, nextMap) || userInfo.arcade == 0) {
        logger.info(`Sufficient stats, using next map`);
        return nextMap;
    } else {
        logger.info(`Insufficient stats, using previous map`);
        return await getArcadeMap(userInfo.account, nextMap.level - 1);
    }
}
