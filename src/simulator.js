const { logger } = require("./logger");

/**
 * Return
 * +1 if player1 wins
 * -1 if player2 wins
 * 0 if draw
 */
module.exports.simulate = function (player1, player2, details = false) {
  let time1 = 0, time2 = 0;
  let life1 = player1.life, life2 = player2.life;
  let force1 = player1.force, force2 = player2.force;
  let speed1 = player1.speed, speed2 = player2.speed;

  while (life1 > 0 && life2 > 0) {
    time1++;
    time2++;

    if (time1 == 2500 - speed1) {
      life2 -= force1;
      time1 = 0;
      details && console.log(`${life1} / ${life2}`);
    }

    if (time2 == 2500 - speed2) {
      life1 -= force2;
      time2 = 0;
      details && console.log(`${life1} / ${life2}`);
    }
  }

  if (life1 <= 0 && life2 <= 0) {
    logger.debug(`Draw`);
    return 0;
  } else if (life1 <= 0) {
    logger.debug(`Player 2 win`);
    return -1;
  } else {
    logger.debug(`Player 1 win`);
    return 1;
  }
};
