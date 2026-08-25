import mongoose from "mongoose";
import Video from "../Modals/video.js";
// Upload Video
export const uploadvideo = async (req, res) => {
  console.log(req.files);
  console.log(req.body);
  if (!req.files || !req.files.file) {
    return res
      .status(400)
      .json({ message: "Please upload an mp4 video file only" });
  }
  try {
    const videoFile = req.files?.file?.[0];
const thumbnailFile = req.files?.thumbnail?.[0];
if (!videoFile || !thumbnailFile) {
  return res.status(400).json({message: "Files missing"});
}
const file = new Video({
  title: req.body.videotitle,
  filename: videoFile.originalname,
  filepath: videoFile.path,
  thumbnail: thumbnailFile.path,
  filetype: videoFile.mimetype,
  filesize: videoFile.size,
  videochannel: req.body.videochannel,
  uploader: req.body.uploader,
});
console.log(file)
    await file.save();
    return res.status(201).json({ message: "File uploaded successfully" });
  } catch (error) {
    console.log(error)
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
// Get All Videos
export const getallvideo = async (req, res) => {
  try {
    console.log("DATABASE:", mongoose.connection.name);
    console.log("MODEL COLLECTION:", Video.collection.name);

    const count = await Video.countDocuments();
    console.log("VIDEOS FOUND:", count);

    const files = await Video.find();

    return res.status(200).json({ videos: files });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
// Get Video By ID (FIXED VERSION)
export const getVideoById = async (req, res) => {
  try {
    const { id } = req.params;
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid video id" });
    }
    const singleVideo = await Video.findById(id);
    if (!singleVideo) {
      return res.status(404).json({ message: "Video not found" });
    }
    return res.status(200).json(singleVideo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
// Search Videos
export const searchVideos = async (req, res) => {
  try {
    const query = req.query.q;
    if(!query){
    return res.status(400).json([]);
    }
    const videos = await Video.find({
      title: { $regex: query, $options: "i" },
    });
    return res.status(200).json(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Search failed" });
  }
};