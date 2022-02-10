const WebSocket = require("ws");
const { exit } = require("process");
const { sleep } = require('./utils');
const context = require('./context');

const WS_URL = "ws://api.mezukotai.com";
let ws;

module.exports.play = () => {
    ws = new WebSocket(WS_URL);
    ws.on("open", onConnect);
    ws.on("message", onMessage);
    ws.on("error", onError);
}

/**
 * Callbacks
 */
async function onConnect() {
  console.log("Connection opened");
}

async function onMessage(data) {
  const str = data.toString("utf-8");
  console.log("< ", str);
  const message = JSON.parse(str);

  if (message.type == "hello") {
    await onLogin(message);
    return;
  }

  switch (message.action) {
    case "timeout":
      break;
    case "start":
      break;
    case "update":
      await onUpdate(message);
      break;
    case "key":
      await onKey(message);
      break;
    case "enemyfight":
      break;
    case "end":
      exit(0);
    default:
      console.warn("Unsupported action:", message);
  }
}

async function onError(error) {
  console.error(error);
}

async function send(message) {
  const data = JSON.stringify(message);
  console.log("> ", data);
  ws.send(data);
}

/**
 * Message handlers
 */
async function onLogin(message) {
  send({
    account: context.account,
    action: "login",
  });
  await sleep(2000);
  send({
    account: context.account,
    action: "start",
    map: context.map._id,
    nft: context.mezurashi.id,
  });
}

async function onUpdate(message) {
  const { action, ...rest } = message;
  context.game = rest;
}

async function onKey(message) {
  if (message.key) {
    send({
      account: context.account,
      action: "game",
      key: message.key,
      gameId: context.game.gameId,
    });
  } else {
    // Key acknoledgement
  }
}
