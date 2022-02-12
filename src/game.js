const { WS } = require("./ws");
const { sleep } = require("./utils");

module.exports.play = async (mezurashi, map) => {
  return new Promise((resolve, reject) => {
    const game = {};
    const ws = new WS(
      onMessage(mezurashi, game, map, resolve),
      onError(reject)
    );
  });
};

/**
 * Callbacks
 */
function onMessage(mezurashi, game, map, resolve) {
  return async (ws, message) => {
    if (message.type == "hello") {
      await onLogin(ws, mezurashi, map);
      return;
    }

    switch (message.action) {
      case "update":
        await onUpdate(message, game);
        break;
      case "key":
        await onKey(ws, message, mezurashi, game);
        break;
      case "end":
        await onEnd(message, game, resolve);
        break;
      case "enemyfight":
      case "timeout":
      case "start":
        break;
      default:
        console.warn("Unsupported action:", message);
    }
  };
}

function onError(reject) {
  return () => reject();
}

/**
 * Message handlers
 */
async function onLogin(ws, mezurashi, map) {
  ws.send({
    account: mezurashi.account,
    action: "login",
  });
  await sleep(2000);
  ws.send({
    account: mezurashi.account,
    action: "start",
    map: map._id,
    nft: mezurashi.id,
  });
}

async function onUpdate(message, game) {
  const { action, ...updatedGame } = message;
  Object.assign(game, updatedGame);
}

async function onKey(ws, message, mezurashi, game) {
  if (message.key) {
    ws.send({
      account: mezurashi.account,
      action: "game",
      key: message.key,
      gameId: game.gameId,
    });
  } else {
    // Key acknoledgement
  }
}

async function onEnd(message, game, resolve) {
  console.log(`End fight: remainingLife=${game.userLife} result=${message.result} reward=${message.kota}$`);
  resolve();
}
