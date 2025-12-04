import dotenv from "dotenv/config";
import http from "http";
import app from "./src/app.js";
import { connectDB, disconnectDB } from "./src/config/database.js";

const port = process.env.PORT || 7675;

const server = http.createServer(app);

// Connect to MongoDB then start server
await connectDB();

server.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server running on port ${port}`);
});

async function shutdown(signal) {
  // eslint-disable-next-line no-console
  console.log(`Received ${signal}. Closing server...`);
  await disconnectDB();
  server.close(() => {
    // eslint-disable-next-line no-console
    console.log("Server closed.");
    process.exit(0);
  });
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
