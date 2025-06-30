import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Server } from "socket.io";
import http from "http";
import csvRoutes from "./routes/csv.route.js";
import { initQueueWorker } from "./jobs/worker.js";

dotenv.config();

const app: Application = express();
const server = http.createServer(app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["POST", "GET"],
  },
});

const PORT = process.env.PORT || 7000;

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(express.json());

io.on("connection", (socket) => {
  console.log("🔥 New client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

app.use("/api/csv", csvRoutes);

initQueueWorker();

server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
