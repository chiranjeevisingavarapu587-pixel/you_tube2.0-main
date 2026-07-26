import React, { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Clock } from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import { useUser } from "@/lib/AuthContext";
import { useRouter } from "next/router";
interface VideoInfoProps {
  video: any;
}
const VideoInfo: React.FC<VideoInfoProps> = ({ video }) => {
  const router=useRouter()
  const [downloadStatus, setDownloadStatus]=useState("");
  const currentUser= JSON.parse(localStorage.getItem("user") || "{}")
  const handleDownload=async()=>{
    try{
      await axiosInstance.post("/download",{
        userId:currentUser._id,
        videoid:video._id
      })
      window.open(video.videoUrl)
    }catch(error){
      console.log(error)
    }
  }
  const { user } = useUser();
  const [likes, setLikes] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isWatchLater, setIsWatchLater] = useState<boolean>(false);
  const [subscribed, setSubscribed]=useState(false);
  // Sync likes when video loads
  useEffect(() => {
  if (!video?._id) return;
  setLikes(video.likes || 0);
    addHistory();
}, [video?._id]);
  useEffect(() => {
    const checkLiked = async () => {
      if (!user || !video?._id) return;
      try {
        const res = await axiosInstance.get(`/likes/${user._id}`);
        const alreadyLiked = res.data.some(
          (item: any) => item.videoid === video._id
        );
        setIsLiked(alreadyLiked);
      } catch (err) {
        console.log(err);
      }
    };
    checkLiked();
  }, [user, video]);
  const handleLike = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/likes/${video._id}`, {
        userId: user._id,
      });
      const updated = await axiosInstance.get(`/video/${video._id}`);
      setLikes(updated.data.likes);
      setIsLiked(res.data.liked);
    } catch (error) {
      console.log(error);
    }
  };
  const handleWatchLater = async () => {
    if (!user) return;
    try {
      const res = await axiosInstance.post(`/watch/${video._id}`, {
        userId: user._id,
      });
      setIsWatchLater(res.data.watchlater);
    } catch (error) {
      console.log(error);
    }
  };
  const addHistory = async () => {
  if (!user?._id || !video?._id) return;
  try {
    await axiosInstance.post(`/history/${video._id}`, {
      userId: user._id,
    });
  } catch (error) {
    console.log(error);
  }
};

  if (!video) return null;
  return (
    <div className="space-y-4">
      <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold leading-tight">{video.videotitle || video.title}</h1>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold">{video.videochanel || video.videochannel || "Channel"}</p>
            <p className="text-sm text-gray-500">1.2M subscribers</p>
          </div>
          <button onClick={()=>alert("Subscribed")}
          className="rounded-full bg-black px-5 py-2 text-white transition hover:bg-gray-800 dark:bg-white dark:text-black">
            Subscribe
          </button>
        </div>
        {/* RIGHT SIDE BUTTONS */}
        <div className="flex flex-wrap gap-2">
          {/* LIKE */}
          <button
            onClick={handleLike}
            className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 rounded-full bg-gray-100 border border-gray-200 text-black dark:text-black"
          >
            <ThumbsUp
            size={18}
            className={isLiked ? "text-black" : "text-gray-500"}
            />
            {likes}
            </button>
          {/* DISLIKE (UI only) */}
          <button onClick={()=>alert("Disliked")}
          className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 rounded-full bg-gray-100 border border-gray-200 text-black dark:text-black">
            <ThumbsDown size={18} />
          </button>
          {/* WATCH LATER */}
          <button
  onClick={handleWatchLater}
  className={`flex flex-wrap items-center gap-2 px-4 py-2 rounded-full border ${
    isWatchLater
      ? "bg-black text-white border-black"
      : "bg-gray-100 border-gray-200 text-black"
  }`}
>
  <Clock
    size={18}
    className={isWatchLater ? "text-white" : "text-black"}
  />
  <span
  className={`hidden sm:inline ${
    isWatchLater ? "text-white" : "text-black"
  }`}
>
    Watch Later
  </span>
</button>
          {/* SHARE */}
          <button onClick={()=>{navigator.clipboard.writeText(window.location.href); alert("Link copied!");}}
          className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 rounded-full bg-gray-100 border border-gray-200 text-black dark:text-black">
            <Share2 size={18} />
            <span className="hidden sm:inline">
  Share
</span>
          </button>
          {/* DOWNLOAD */}
          <button
                onClick={async()=>{
                  setDownloadStatus("Downloading...");
                  try{
                    console.log(video)
                    console.log(video._id)
                    await axiosInstance.post("/download",{
                    userId:user._id,
                    videoid:video._id,
                    plan:localStorage.getItem("plan") || "free"
                  })
                  await new Promise((resolve)=>setTimeout(resolve, 2000))
                  setDownloadStatus("Added to Downloads ✓");
                 setTimeout(() => {
                    setDownloadStatus("");
                    }, 2000);
                  }catch(err:any){
                    
                   const plan = localStorage.getItem("plan") || "free";
                   const premiumExpiry = localStorage.getItem("premiumExpiry");
                   const isPremiumActive =plan==="gold" && premiumExpiry && new Date(premiumExpiry) > new Date();
                   console.log("PLAN:", plan)
                   console.log("EXPIRY:", premiumExpiry)
                   console.log("PREMIUM ACTIVE:", isPremiumActive)
                   if (isPremiumActive){
                   setDownloadStatus("Added to Downloads ✓");
                   setTimeout(() => {
                   setDownloadStatus("");
                 }, 2000);
                    return;
                 } else if (err.response?.data?.message?.includes("Free users") ||
                            err.response?.data?.message?.includes("Bronze") ||
                            err.response?.data?.message?.includes("Silver")) {
                              alert(err.response.data.message)
                  setDownloadStatus("Limit Reached!")
                  setTimeout(()=>{
                   router.push("/premium?message=limit")},500)
                   } else {
                      alert(err.response?.data?.message || "Please Sign in to download");
                  }}
              }}
          className="flex items-center gap-2 rounded-full px-3 py-2 sm:px-4 rounded-full bg-gray-100 border border-gray-200 text-black dark:text-black">
            <Download size={18} />
            <span className="whitespace-nowrap hidden sm:inline">
  {downloadStatus || "Download"}
</span>
          </button>
          {/* MORE */}
          <button onClick={()=>alert("More options coming soon")}
          className="p-2 rounded-full bg-gray-100 border border-gray-200 text-black dark:text-black">
            <MoreHorizontal size={18} />
          </button>
        </div>
      </div>
      {/* DESCRIPTION */}
      <div className="rounded-xl bg-gray-100 p-4 dark:bg-neutral-800">
        <p className="text-sm text-gray-700 dark:text-gray-300">
          {video.views} views •{" "}
          {video?.createdAt? new Date(video.createdAt).toLocaleDateString():"Recently uploaded"}
        </p>
        <p className="mt-2 whitespace-pre-line text-black dark:text-white">{video.description}</p>
      </div>
    </div>
  );
};
export default VideoInfo;