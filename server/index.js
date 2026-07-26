import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import userroutes from "./routes/auth.js";
import videoroutes from "./routes/video.js";
import likeRoutes from "./routes/like.js";
import watchlaterroutes from "./routes/watchlater.js";
import downloadRoutes from "./routes/download.js";
import historyrroutes from "./routes/history.js";
import commentroutes from "./routes/comment.js";
import premiumroutes from "./routes/premium.js";
import http from "http";
import { Server } from "socket.io";
import callroutes from "./routes/call.js";
dotenv.config();
console.log("EMAIL_USER=", process.env.EMAIL_USER);
console.log("EMAIL_PASS=", process.env.EMAIL_PASS);
console.log("EMAIL_PASS LENGTH:", process.env.EMAIL_PASS?.length);
import path from "path";
import {fileURLToPath} from "url";
const __filename=fileURLToPath(import.meta.url);
const __dirname=path.dirname(__filename);
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [
    "http://localhost:3000",
    "http://192.168.43.57:3000",
    ],
    credentials: true,
  },
});
app.use(
  cors({
    origin:["http://localhost:3000",
    "http://192.168.43.57:3000",
    ],
    credentials:true,
  })
);
app.use(express.json({ limit: "30mb", extended: true }));
app.use("/call", callroutes);
app.use(express.urlencoded({ limit: "30mb", extended: true }));
app.use("/download", downloadRoutes)
app.use("/uploads", express.static("uploads"));
app.get("/", (req, res) => {
  res.send("Youtube backend is working");
});
app.use(bodyParser.json());
app.use("/user", userroutes);
app.use("/video", videoroutes);
app.use("/likes", likeRoutes);
app.use("/watch", watchlaterroutes);
app.use("/history", historyrroutes);
app.use("/comment", commentroutes);
app.use("/premium", premiumroutes);
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
io.on("connection", (socket) => {
  console.log("User Connected:", socket.id);
  socket.on("create-room", ({ roomId }) => {
  socket.join(roomId);
  console.log("Room Created:", roomId);
});
socket.on("join-room", ({ roomId }) => {
  socket.join(roomId);
  socket.to(roomId).emit("user-joined");
  console.log("User Joined:", roomId);
});
socket.on("offer", ({ roomId, offer }) => {
  console.log("Offer received:", roomId);
  socket.to(roomId).emit("offer", offer);
});
socket.on("answer", ({ roomId, answer }) => {
  console.log("Answer received:", roomId);
  socket.to(roomId).emit("answer", answer);
});
socket.on("ice-candidate", ({ roomId, candidate }) => {
  console.log("ICE Candidate:", roomId);
  socket.to(roomId).emit("ice-candidate", candidate);
});
socket.on("end-call", ({ roomId }) => {
  console.log("Call Ended:", roomId);
  socket.to(roomId).emit("end-call");
});
  socket.on("disconnect", () => {
    console.log("User Disconnected:", socket.id);
  });
});
const DBURL = process.env.DB_URI;
mongoose
  .connect(DBURL)
  .then(() => {
    console.log("Mongodb connected");
  })
  .catch((error) => {
    console.log(error);
  });