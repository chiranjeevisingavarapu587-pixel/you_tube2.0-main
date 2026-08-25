import video from "../Modals/video.js";
import like from "../Modals/like.js";
export const handlelike = async (req, res) => {
  const { userId } = req.body;
  const { videoid } = req.params;
  try {
    const exisitinglike = await like.findOne({
      viewer: userId,
      videoid: videoid,
    });
    if (exisitinglike) {
      await like.findByIdAndDelete(exisitinglike._id);
      await video.findByIdAndUpdate(videoid, { $inc: { likes: -1 } });
      return res.status(200).json({ liked: false });
    } else {
      await like.create({ viewer: userId, videoid: videoid });
      await video.findByIdAndUpdate(videoid, { $inc: { likes: 1 } });
      return res.status(200).json({ liked: true });
    }
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};
export const getallLikedVideo = async (req, res) => {
  const { userId } = req.params;

  try {
    console.log("LIKED VIDEOS USER ID:", userId);

    const likevideo = await like
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .lean();

    console.log("LIKED VIDEOS RESULT:", likevideo);

    return res.status(200).json(likevideo);
  } catch (error) {
    console.error("GET LIKED VIDEOS ERROR:", error);

    return res.status(500).json({
      message: "Something went wrong",
      error: error.message,
    });
  }
};
export const handleUnlikeVideo = async (req, res) => {
  const { userId } = req.body;
  const { videoid } = req.params;
  try {
    await like.findOneAndDelete({
      viewer: userId,
      videoid: videoid,
    });
    await video.findByIdAndUpdate(videoid, {
      $inc: { likes: -1 },
    });
    return res.status(200).json({
      liked: false,
    });
  } catch (error) {
    console.error("error:", error);
    return res.status(500).json({
      message: "Something went wrong",
    });
  }
};