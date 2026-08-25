import{searchVideos} from "../controllers/video.js";
import {streamVideo} from "../controllers/videoStream.js";
import express from "express";
import { getallvideo, uploadvideo, getVideoById} from "../controllers/video.js";
import upload from "../filehelper/filehelper.js";
const routes = express.Router();
routes.post("/upload", upload.fields([
    { name: "file", maxCount:1},
    { name:"thumbnail", maxCount:1}
]), uploadvideo);
routes.get("/getall", getallvideo);
routes.get("/search",searchVideos);
routes.get("/stream/:filename", streamVideo);
routes.get("/video/:filename", streamVideo);
routes.get("/:id",getVideoById);
export default routes;