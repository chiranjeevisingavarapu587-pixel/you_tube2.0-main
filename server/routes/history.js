import express from "express";
import {
  getallhistoryVideo,
  handlehistory,
  handleview,
} from "../controllers/history.js";

const routes = express.Router();
routes.get("/user/:userId", getallhistoryVideo);
routes.post("/views/:videoid", handleview);
routes.post("/:videoid", handlehistory);
export default routes;
