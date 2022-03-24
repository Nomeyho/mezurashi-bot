const { getMezurashis } = require("./client");
const { play } = require("./mezurashi");
const { logger } = require("./logger");
const { ACCOUNT } = require("./config");

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

main(ACCOUNT);
