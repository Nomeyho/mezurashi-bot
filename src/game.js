const WebSocket = require("ws");
const { sleep } = require("./utils");

const WS_URL = "ws://api.mezukotai.com";
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0',
    'Accept': '*/*',
    'Accept-Language': 'en-US,en;q=0.5',
    'Accept-Encoding': 'gzip, deflate, br',
    'Sec-WebSocket-Version': 13,
    'Origin': 'https://game.mezukotai.com',
    'Sec-WebSocket-Extensions': 'permessage-deflate',
 //   'Sec-WebSocket-Key': 'CWr6O2P9Wiya+XM5ge9Ntg==',
    'Connection': 'keep-alive, Upgrade',
    'Sec-Fetch-Dest': 'websocket',
    'Sec-Fetch-Mode': 'websocket',
    'Sec-Fetch-Site': 'same-site',
    'Pragma': 'no-cache',
    'Cache-Control': 'no-cache',
    'Upgrade': 'websocket',
};

let ws;
let game, mezurashi, map, resolve;

module.exports.play = async (_mezurashi, _map) => {
  return new Promise((_resolve, _reject) => {
    mezurashi = _mezurashi;
    map = _map;
    resolve = _resolve;
    ws = new WebSocket(WS_URL, { headers: HEADERS });
    ws.on("message", onMessage);
    ws.on("error", onError);
  });
};

/**
 * Callbacks
 */
async function onMessage(data) {
  const str = data.toString("utf-8");
  // console.log("< ", str);
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
      console.log(`Result: ${message.result} ${message.kota}$`);
      resolve();
      break;
    default:
      console.warn("Unsupported action:", message);
  }
}

async function onError(error) {
  console.error(error);
}

async function send(message) {
  const data = JSON.stringify(message);
  // console.log("> ", data);
  ws.send(data);
}

/**
 * Message handlers
 */
async function onLogin(message) {
  send({
    account: mezurashi.account,
    action: "login",
  });
  await sleep(2000);
  send({
    account: mezurashi.account,
    action: "start",
    map: map._id,
    nft: mezurashi.id,
  });
}

async function onUpdate(message) {
  const { action, ...rest } = message;
  game = rest;
}

async function onKey(message) {
  if (message.key) {
    send({
      account: mezurashi.account,
      action: "game",
      key: message.key,
      gameId: game.gameId,
    });
  } else {
    // Key acknoledgement
  }
}
