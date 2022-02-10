const { getArcadeMap, upgradeMezurashi, getUserInfo, getMezurashi } = require('./client');
const { account } = require('./context');
const context = require('./context');
const { play } = require('./game');
const { sleep } = require('./utils');

/**
 * 1 try again
 * 2 +5
 * 3 +10
 * 4 you loose
 * 5 +8
 * 6 +10 specials
 */

module.exports.process = async function () {
    if (context.mezurashi.gameCount == 10) {
        console.log('No more game to play');
        return;
    } 

    const nextMap = await getArcadeMap(account, context.userInfo.arcade);
    context.nextMap = nextMap;

    const hasRequiredStats = await upgradeStats();
    const map = await selectMap(hasRequiredStats);
    context.map = map;
    console.log(`Using map: ${map.name} (level=${map.level}, id=${map._id})`);

    play();
}

async function upgradeStats() {
    for (const stat of ['life', 'force', 'speed', 'critical']) {
        if (!await upgradeStat(stat)) {
            return false;
        }
    }

    return true;
}

async function upgradeStat(stat) {
    let mezuStat = context.mezurashi[stat];
    const requiredStat = context.nextMap[stat];
    console.log(`Next map requires: ${mezuStat}/${requiredStat} ${stat}`);

    while (mezuStat < requiredStat) {
        if (context.userInfo.mezuwar >= 50) {
            await upgradeMezurashi(context.account, context.mezurashi._id, stat);
            await sleep(1000);
            context.userInfo = await getUserInfo(context.account);
            await sleep(1000);
            context.mezurashi = await getMezurashi(context.account, context.mezurashi._id);            
            console.log(`Upgraded: life=${context.mezurashi.life}, force=${context.mezurashi.force}, speed=${context.mezurashi.speed}, critical=${context.mezurashi.critical}`);
            mezuStat = context.mezurashi[stat];
        } else {
            console.log(`No more money to upgrade '${stat}': ${context.userInfo.mezuwar}$`);
            return false;
        }
    }

    return true;
}

async function selectMap(hasRequiredStats) {
    if (hasRequiredStats) {
        return context.nextMap;
    } else {
        // Switch to previous map
        return await getArcadeMap(account, context.userInfo.arcade - 1);
    }
}
