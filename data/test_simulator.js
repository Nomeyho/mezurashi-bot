const { simulate } = require('../src/simulator');

const player1 = { life: 254, force: 40, speed: 19, time: 0 };
const player2 = {  life: 192,  force: 29, speed: 15, time: 0 };

const res = simulate(player1, player2, true);
console.log(res);
