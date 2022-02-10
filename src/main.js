
const { getUserInfo, getMezurashis } = require('./client');
const context = require('./context');
const { process } = require('./mezurashi');

// TODO: add timestamp to logs

const main = async () => {
  const userInfo = await getUserInfo(context.account);
  console.log(`Account id=${context.account} arcade=${userInfo.arcade}, history=${userInfo.currentMap}, mezuwar=${userInfo.mezuwar}`);
  context.userInfo = userInfo;

  const mezurashis = await getMezurashis(context.account);
  context.mezurashis = mezurashis;
  console.log(`Loaded ${mezurashis.length} mezurashis`);

  for (const mezurashi of mezurashis) {
    console.log(`Selected Mezurashi #${mezurashi.id} (id=${mezurashi._id})`);
    context.mezurashi = mezurashi;
    await process();
  }
};

main();
