const winston = require("winston");

const customFormat = winston.format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}] ${message}`;
});

module.exports.logger = winston.createLogger({
  level: "debug",
  format: winston.format.combine(winston.format.timestamp(), customFormat),
  transports: [
    new winston.transports.File({
      filename: `logs/logs-${new Date().toISOString().split('T')[0]}.log`,
      level: "debug"
    }),
    new winston.transports.Console({ level: "info" }),
  ],
});
