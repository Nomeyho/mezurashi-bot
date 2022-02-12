const { getArcadeMap, getMezurashi, getUserInfo } = require('./client');
const { play } = require('./game');
const { upgradeStats, hasRequiredStats } = require('./stats');
const { sleep } = require("./utils");

/**
 * TODO:
 * - logger
 * - add timestamp to logs
 */

const MAX_GAME_COUNT = 10;

module.exports.play = async function (userInfo, mezurashi) {

    while (mezurashi.gameCount < MAX_GAME_COUNT) {
        const nextMap = await getArcadeMap(userInfo.account, userInfo.arcade);
        console.log(`Next map: ${nextMap.name} (level=${nextMap.level}, id=${nextMap._id})`);

        await upgradeStats(userInfo, mezurashi, nextMap);
        await sleep(500);
        
        const map = await selectMap(userInfo, mezurashi, nextMap);
        console.log(`Map: ${map.name} (level=${map.level}, id=${map._id})`);
        console.log(
            `Mezurashi stats: life=${mezurashi.life}, force=${mezurashi.force}, speed=${mezurashi.speed}, critical=${mezurashi.critical}`
        );
        console.log(
            `Enemy stats: life=${map.life}, force=${map.force}, speed=${map.speed}, critical=${map.critical}`
        );
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
        console.log(`Sufficient stats, using next map`);
        return nextMap;
    } else {
        console.log(`Insufficient stats, using previous map`);
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
