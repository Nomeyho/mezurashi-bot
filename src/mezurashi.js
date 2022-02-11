const { getArcadeMap, upgradeMezurashi, getUserInfo, getMezurashi } = require('./client');
const { play } = require('./game');
const { upgradeStats } = require('./stats');

/**
 * TODO:
 * - logger
 * - refactoring
 * - add random delay
 * - add more headers
 * - add timestamp to logs
 * 1 try again
 * 2 +5
 * 3 +10
 * 4 you loose
 * 5 +8
 * 6 +10 specials
 */

module.exports.play = async function (userInfo, mezurashi) {

    while (mezurashi.gameCount < 10) {
        const nextMap = await getArcadeMap(userInfo.account, userInfo.arcade);
        const hasRequiredStats = await upgradeStats(userInfo, mezurashi, nextMap);
        const map = await selectMap(hasRequiredStats, userInfo, nextMap);
        console.log(`Using map: ${map.name} (level=${map.level}, id=${map._id})`);
        await play(mezurashi, map);
    }

    console.log('No more game to play');
}

async function selectMap(hasRequiredStats, userInfo, nextMap) {
    if (hasRequiredStats || userInfo.arcade == 0) {
        return nextMap;
    } else {
        // Switch to previous map
        return await getArcadeMap(userInfo.account, userInfo.arcade - 1);
    }
}
