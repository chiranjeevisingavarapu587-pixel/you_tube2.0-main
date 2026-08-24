import mongoose from "mongoose";
import Download from "../Modals/download.js";
import User from "../Modals/User.js";
export const addDownload = async (req, res) => {
  try {
    const { userId, videoid, plan } = req.body;
    console.log(req.body);
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    // TODAY DATE
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // TODAY DOWNLOADS
    const downloadsToday = await Download.find({
      userId: userId,
      createdAt: {
        $gte: today,
      },
    });
    /*const existing = await Download.findOne({
      userId,
      videoid,
    });
    if (existing) {
      return res.status(403).json({
        message: "Video already downloaded",
      });
    }*/
    console.log("TODAY DOWNLOADS:", downloadsToday.length);
    // CURRENT PLAN
    const currentPlan = String(plan || "free")
      .trim()
      .toLowerCase();
    console.log("CURRENT PLAN:", currentPlan);
    // FREE PLAN LIMIT
    if (
      currentPlan === "free" &&
      downloadsToday.length >= 1
    ) {
      return res.status(403).json({
        message: "Free users can download only 1 video per day",
      });
    }
    // SAVE DOWNLOAD
    const newDownload = new Download({
      userId,
      videoid,
    });
    await newDownload.save();
    return res.status(201).json(newDownload);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Server error",
    });

  }
};
// GET USER DOWNLOADS
export const getUserDownloads = async (req, res) => {
  try {
    const { userId } = req.params;
    const downloads = await Download.find({
      userId,
    }).populate("videoid");
    console.log(downloads);
    res.status(200).json(downloads);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};
// REMOVE DOWNLOAD
export const removeDownload = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Download.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({
        message: "Download not found",
      });
    }
    res.status(200).json({
      message: "Removed successfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Server error",
    });
  }
};