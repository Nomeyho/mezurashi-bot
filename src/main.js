const { getUserInfo, getMezurashis } = require("./client");
const { play } = require("./mezurashi");
const { logger } = require("./logger");

const main = async (account) => {
  const userInfo = await getUserInfo(account);
  logger.info(
    `Account: id=${account} arcade=${userInfo.arcade}, history=${userInfo.currentMap}, mezuwar=${userInfo.mezuwar}`
  );

  const mezurashis = await getMezurashis(account);
  logger.info(`Loaded ${mezurashis.length} mezurashis`);

  for (let i = 0; i < mezurashis.length; i++) {
    const mezurashi = mezurashis[i];
    logger.info(
      `Mezurashi ${i}/${mezurashis.length}: #${mezurashi.id}, id=${mezurashi._id}, games=${mezurashi.gameCount}/10`
    );
    await play(userInfo, mezurashi);
  }
};

// main('0xA2Ed91BF97377eB418804c302319fa26f258292A');
main("0x1fA8501DbCb2f553Ddf6e2c8b052A8e862FD2c11");
