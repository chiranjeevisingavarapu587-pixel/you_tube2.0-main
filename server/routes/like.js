import express from "express";
import { handlelike, getallLikedVideo, handleUnlikeVideo } from "../controllers/like.js";
const routes = express.Router();
routes.get("/:userId", getallLikedVideo);
routes.delete("/:videoid", handleUnlikeVideo);
routes.post("/:videoid", handlelike);
export default routes;