const { getMezurashi, getUserInfo } = require("./client");
const { play } = require("./game");
const { upgradeStats } = require("./stats");
const { getNextMap, selectMap } = require("./map");
const { sleep } = require("./utils");
const { logger } = require("./logger");

const MAX_GAME_COUNT = 10;

module.exports.play = async function (userInfo, mezurashi) {
  while (mezurashi.gameCount < MAX_GAME_COUNT) {
    logger.info(`Game: ${mezurashi.gameCount}`);
    
    const nextMap = await getNextMap(userInfo, mezurashi);
    logger.info(
      `Next map: ${nextMap.name} (level=${nextMap.level}, id=${nextMap._id})`
    );

    await upgradeStats(userInfo, mezurashi, nextMap);
    await sleep(500);

    const map = await selectMap(userInfo, mezurashi, nextMap);
    logger.info(`Map: ${map.name} (level=${map.level}, id=${map._id})`);
    logger.info(
      `Mezurashi stats: life=${mezurashi.life}, force=${mezurashi.force}, speed=${mezurashi.speed}, critical=${mezurashi.critical}`
    );
    logger.info(
      `Enemy stats: life=${map.life}, force=${map.force}, speed=${map.speed}, critical=${map.critical}`
    );
    await sleep(500);

    await play(mezurashi, map);
    await sleep(1000);

    await refreshMezurashi(mezurashi);
    await refreshUserInfo(userInfo, mezurashi);
    await sleep(2000);
  }

  logger.info("No more game to play");
};

async function refreshMezurashi(mezurashi) {
  const updatedMezurashi = await getMezurashi(mezurashi.account, mezurashi._id);
  Object.assign(mezurashi, updatedMezurashi);
}

async function refreshUserInfo(userInfo, mezurashi) {
  const updatedUserInfo = await getUserInfo(userInfo.account, mezurashi);
  Object.assign(userInfo, updatedUserInfo);
}
