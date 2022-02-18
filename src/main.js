const { getMezurashis } = require("./client");
const { play } = require("./mezurashi");
const { logger } = require("./logger");

const main = async (account) => {
  logger.info(`Account: ${account}`);
  const mezurashis = await getMezurashis(account);
  logger.info(`Loaded ${mezurashis.length} mezurashis`);

  for (let i = 0; i < mezurashis.length; i++) {
    const mezurashi = mezurashis[i];
    logger.info(
      `Mezurashi ${i+1}/${mezurashis.length}: #${mezurashi.id}, id=${mezurashi._id}, games=${mezurashi.gameCount}/10`
    );
    await play(mezurashi);
  }
};

// main('0xA2Ed91BF97377eB418804c302319fa26f258292A');
main("0x1fA8501DbCb2f553Ddf6e2c8b052A8e862FD2c11");
