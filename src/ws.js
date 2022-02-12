const WebSocket = require("ws");

const WS_URL = "ws://api.mezukotai.com";
const HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:96.0) Gecko/20100101 Firefox/96.0",
  Accept: "*/*",
  "Accept-Language": "en-US,en;q=0.5",
  "Accept-Encoding": "gzip, deflate, br",
  "Sec-WebSocket-Version": 13,
  Origin: "https://game.mezukotai.com",
  "Sec-WebSocket-Extensions": "permessage-deflate",
  //'Sec-WebSocket-Key': 'CWr6O2P9Wiya+XM5ge9Ntg==',
  Connection: "keep-alive, Upgrade",
  "Sec-Fetch-Dest": "websocket",
  "Sec-Fetch-Mode": "websocket",
  "Sec-Fetch-Site": "same-site",
  Pragma: "no-cache",
  "Cache-Control": "no-cache",
  Upgrade: "websocket",
};

module.exports.WS = class WS {
  constructor(onMessage, onError) {
    this.onMessage = onMessage;
    this.onError = onError;
    this.ws = new WebSocket(WS_URL, { headers: HEADERS });
    this.ws.on("message", this._onMessage.bind(this));
    this.ws.on("error", this._onError.bind(this));
  }

  _onMessage(data) {
    const str = data.toString("utf-8");
    console.log("< ", str);
    const message = JSON.parse(str);
    return this.onMessage(this, message);
  }

  _onError(error) {
    console.error(error);
    return this.onError(this, error);
  }

  send(message) {
    const data = JSON.stringify(message);
    console.log("> ", data);
    this.ws.send(data);
  }
};
