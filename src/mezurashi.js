const { getArcadeMap, getMezurashi, getUserInfo } = require('./client');
const { play } = require('./game');
const { upgradeStats, hasRequiredStats } = require('./stats');
const { sleep } = require("./utils");

/**
 * TODO:
 * - logger
 *      - add timestamp to logs
 *      - improve logs
 
 * 1 try again
 * 2 +5
 * 3 +10
 * 4 you loose
 * 5 +8
 * 6 +10 specials
 */

const MAX_GAME_COUNT = 10;

module.exports.play = async function (userInfo, mezurashi) {

    while (mezurashi.gameCount < MAX_GAME_COUNT) {
        const nextMap = await getArcadeMap(userInfo.account, userInfo.arcade);
        await upgradeStats(userInfo, mezurashi, nextMap);
        await sleep(500);
        
        const map = await selectMap(userInfo, mezurashi, nextMap);
        console.log(`Using map: ${map.name} (level=${map.level}, id=${map._id})`);
        await sleep(500);

        await play(mezurashi, map);
        await sleep(1000);
        
        await refreshMezurashi(mezurashi);
        await refreshUserInfo(userInfo);
        await sleep(1000);

        return; // TODO
    }

    console.log('No more game to play');
}

async function selectMap(userInfo, mezurashi, nextMap) {
    if (hasRequiredStats(mezurashi, nextMap) || userInfo.arcade == 0) {
        return nextMap;
    } else {
        // Stick to previous map
        return await getArcadeMap(userInfo.account, userInfo.arcade - 1);
    }
}

async function refreshMezurashi(mezurashi) {
    const updatedMezurashi = await getMezurashi(mezurashi.account, mezurashi._id);
    Object.assign(mezurashi, updatedMezurashi);
  }
  
  async function refreshUserInfo(userInfo) {
    const updatedUserInfo = await getUserInfo(userInfo.account);
    Object.assign(userInfo, updatedUserInfo);
  }
