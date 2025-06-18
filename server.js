require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());

// Create Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins — change in production if needed
    methods: ["GET", "POST"],
  },
});

// Handle socket connection
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("send_message", (data) => {
    if (typeof data.user === "string" && typeof data.text === "string") {
      const message = {
        id: Date.now(), // Simple ID
        user: data.user,
        text: data.text,
        time: new Date().toLocaleTimeString(),
      };
      console.log("📨 Message received:", message);
      io.emit("receive_message", message);
    } else {
      console.log("❌ Invalid message format");
    }
  });

  socket.on("disconnect", () => {
    console.log("❎ User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
