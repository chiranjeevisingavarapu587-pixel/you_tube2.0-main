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
    const likevideo = await like
      .find({ viewer: userId })
      .populate({
        path: "videoid",
        model: "videofiles",
      })
      .lean();
      const formatted=
      likevideo.map(item=>({
        ...item,
        videoid: item.videoid,
      }));
    return res.status(200).json(formatted);
  } catch (error) {
    console.error(" error:", error);
    return res.status(500).json({ message: "Something went wrong" });
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