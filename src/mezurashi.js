const { getMezurashi, getUserInfo } = require("./client");
const { play } = require("./game");
const { upgradeStats, getMap } = require("./stats");
const { sleep } = require("./utils");
const { logger } = require("./logger");

const MAX_GAME_COUNT = 10;

module.exports.play = async function (mezurashi) {
  let userInfo = await getUserInfo(mezurashi.account, mezurashi);

  while (userInfo.gameCount < MAX_GAME_COUNT) {
    logger.info(`Game: ${userInfo.gameCount + 1} (${userInfo.mezuwar}$)`);
    
    await upgradeStats(userInfo, mezurashi);
    await sleep(500);

    const map = await getMap(userInfo, mezurashi);
    logger.info(`Map: ${map.name} (level=${map.level}, id=${map._id}, reward=${map.toWin}$)`);
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
