require("dotenv").config();
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors());

const io = new Server(server, {
  cors: {
    origin: "*", // ⚠️ In production, replace with your frontend domain
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("send_message", (data) => {
    const message = {
      id: Date.now(),
      user: data.user,
      text: data.text || "",
      image: data.image || null,
      video: data.video || null,
      document: data.document || null,
      time: new Date().toLocaleTimeString(),
    };

    const isValid =
      typeof message.user === "string" &&
      (message.text || message.image || message.video || message.document);

    if (isValid) {
      console.log("📨 Message received:", message);
      io.emit("receive_message", message);
    } else {
      console.log("❌ Invalid message format", data);
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
