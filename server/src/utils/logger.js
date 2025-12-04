import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const logFormat = printf(({ level, message, timestamp: ts }) => {
  return `${ts} [${level}]: ${message}`;
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: combine(timestamp(), colorize({ all: true }), logFormat),
  transports: [new winston.transports.Console()],
});

// morgan stream
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

export default logger;
