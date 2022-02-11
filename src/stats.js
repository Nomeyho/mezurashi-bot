const { upgradeMezurashi, getUserInfo, getMezurashi } = require('./client');
const { sleep } = require('./utils');

const stats = ['life', 'force', 'speed', 'critical'];

module.exports.upgradeStats = async function(userInfo, mezurashi, nextMap) {
    for (const stat of stats) {
        if (!await upgradeStat(userInfo, stat, mezurashi, nextMap)) {
            return false;
        }
    }

    return true;
}

async function upgradeStat(userInfo, stat, mezurashi, nextMap) {
    let mezuStat = mezurashi[stat];
    const requiredStat = nextMap[stat];
    console.log(`Next map requires: ${mezuStat}/${requiredStat} ${stat}`);

    while (mezuStat < requiredStat) {
        if (userInfo.mezuwar >= 50) {
            await upgradeMezurashi(mezurashi.account, mezurashi._id, stat);
            await sleep(2000);
            Object.assign(userInfo, await getUserInfo(mezurashi.account));
            Object.assign(mezurashi, await getMezurashi(mezurashi.account, mezurashi._id));
            console.log(`Upgraded: life=${mezurashi.life}, force=${mezurashi.force}, speed=${mezurashi.speed}, critical=${mezurashi.critical}`);
            mezuStat = mezurashi[stat];
        } else {
            console.log(`No more money to upgrade '${stat}': ${userInfo.mezuwar}$`);
            return false;
        }
    }

    return true;
}
