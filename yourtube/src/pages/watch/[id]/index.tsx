import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import VideoInfo from "@/components/VideoInfo";
import Comments from "@/components/Comments";
import VideoPlayer from "@/components/Videopplayer";
import RelatedVideos from "@/components/RelatedVideos";
const WatchPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [video, setVideo] = useState<any>(null);
  const [relatedVideos, setRelatedVideos] = useState<any[]>([]);
  const [showComments, setShowComments] = useState(false);
  const [loading, setLoading]=useState(true);
useEffect(() => {
  if (!id || typeof id !== "string") return;
  const fetchVideo = async () => {
    try {
      const res = await axiosInstance.get(`/video/${id}`);
      console.log("VIDEO OBJECT:", res.data);
      console.log("Channel:", res.data.videochanel);
      setVideo(res.data);
      const related = await axiosInstance.get("/video/getall");
      console.log("RESPONSE DATA:", related.data);
      const filtered=(related.data.videos || []).filter((v: any)=> v._id !==res.data._id);
      console.log("RELATED VIDEOS:", filtered);
      setRelatedVideos(filtered);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchVideo();
}, [id]);
  if (loading) {
  return (
    <div className="flex h-[70vh] items-center justify-center text-lg">
      Loading...
    </div>
  );
}
  if (!video) {
  return (
    <div className="flex h-[70vh] items-center justify-center text-lg">
      Video not found
    </div>
  );
}
  return (
  <div className="w-full max-w-screen-2xl mx-auto px-2 sm:px-4 lg:px-6 py-3">
    <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr)_380px] gap-6">

      {/* Left Section */}
      <div className="min-w-0">

        {/* Sticky Video */}
        <div className="bg-white dark:bg-black mb-4">
          <VideoPlayer
            video={video}
            nextVideoId={relatedVideos[0]?._id}
            toggleComments={() => setShowComments((prev) => !prev)}
          />
        </div>

        <VideoInfo key={video._id} video={video} />

        <div
          onClick={() => setShowComments((prev) => !prev)}
          className="mt-4 cursor-pointer rounded-xl border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-[#272727]
                     text-black dark:text-white
                     p-4 transition
                     hover:bg-gray-100 dark:hover:bg-[#3a3a3a]"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">💬 Comments</h3>

            <span className="text-sm text-gray-600 dark:text-gray-400">
              {showComments ? "Hide" : "Show"}
            </span>
          </div>

          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {showComments
              ? "Tap to hide comments"
              : "Tap to view comments"}
          </p>
        </div>

        {showComments && (
          <Comments
            videoId={video._id}
            onHide={() => setShowComments(false)}
          />
        )}
      </div>

      {/* Right Section */}
      <aside className="w-full xl:sticky xl:top-[72px] xl:max-h-[calc(100vh-72px)] xl:overflow-y-auto">
        <RelatedVideos videos={relatedVideos} />
      </aside>

    </div>
  </div>
);
};
export default WatchPage;