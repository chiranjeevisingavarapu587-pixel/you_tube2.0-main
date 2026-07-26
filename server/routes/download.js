import express from "express"
import {addDownload, getUserDownloads, removeDownload} from "../controllers/download.js"
const router=express.Router()
router.post("/", addDownload)
router.get("/user/:userId", getUserDownloads)
router.delete("/:id", removeDownload)
export default router