import "dotenv/config"; // 🔥 MUST be first — no exceptions

import connectDb from "./src/db/index.js";
import { app } from "./app.js";
import http from "http";
import { initSocket } from "./src/socket.js";

// Wrap Express with HTTP Server for WebSockets
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

connectDb()
  .then(() => {
    // 🔥 IMPORTANT: Use server.listen instead of app.listen
    server.listen(process.env.PORT || 8000, () => {
      console.log(`Server is running on port ${process.env.PORT || 8000}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
  });