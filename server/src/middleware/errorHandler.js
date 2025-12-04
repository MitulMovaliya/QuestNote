import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, next) {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  logger.error(message, { stack: err.stack });
  res.status(status).json({ error: { message } });
}
