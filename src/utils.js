module.exports.sleep = function (ms) {
  const delay = getRandom(ms - ms / 10, ms + ms / 10); // 10% tolerance
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
};

function getRandom(min, max) {
  return Math.random() * (max - min) + min;
}

Object.defineProperty(String.prototype, "capitalize", {
  value: function () {
    return this.charAt(0).toUpperCase() + this.slice(1);
  },
  enumerable: false,
});
