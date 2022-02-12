
module.exports.sleep = function (ms) {
  const delay = getRandom(ms - ms/10, ms + ms/10); // 10% tolerance
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}
