import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import axiosInstance from "../lib/axiosInstance"
const formatTime = (date: any, time: number) => {
  if (!date) return "Just now"
  const now = new Date()
  const past = new Date(date)
  if (isNaN(past.getTime())) return "Just now"
  const diffMs = now.getTime() - past.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffMinutes < 1) return "Just now"
  if (diffMinutes < 60) return diffMinutes + " minutes ago"
  if (diffHours < 24) return diffHours + " hours ago"
  return diffDays + " days ago"
}
const Downloads = () => {
  const router = useRouter()
  const user=typeof window !=="undefined"? JSON.parse(localStorage.getItem("user") || "{}"):null;
  const [videos, setVideos] = useState<any[]>([])
  const [activeMenu, setActiveMenu] = useState<string | null>(null)
  const [time, setTime] = useState(Date.now())
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(Date.now())
    }, 60000)
    return () => clearInterval(interval)
  }, [])
  useEffect(() => {
    axiosInstance
      .get(`/download/user/${user._id}`)
      .then((res: any)=>{
      console.log(res.data); setVideos(res.data)})
      .catch((err) => console.log(err))
  }, [])
  const handleRemove = async (id: string) => {
    try {
      await axiosInstance.delete(`/download/${id}`)
      setVideos((prev) => prev.filter((v) => v._id !== id))
      setActiveMenu(null)
    } catch (err) {
      console.log(err)
    }
  }
  const uniqueVideos=videos.filter(
    (video, index, self)=>
      index===self.findIndex((v)=>v.videoid?._id===video.videoid?._id)
  );
  return (
    <div className="mb-4">
      <h1 className="text-xl font-semibold">Downloads</h1>
      <p className="text-sm text-gray-500">
        {videos.length} {videos.length === 1 ? "video" : "videos"}
      </p>
      {videos.length === 0 ? (
        <p className="text-gray-500 mt-4">No downloads yet</p>
      ) : (
        uniqueVideos.map((item) => {
          console.log(item.videoid)
          return (
          <div
            key={item._id}
            className="flex items-center gap-4 mb-4 cursor-pointer hover:bg-gray-100 p-2 rounded relative group"
            onClick={() => router.push(`/watch/${item.videoid?._id}`)}
          >
            <img
              src={`/video/${item.videoid?.thumbnail}`}
              alt="thumbnail"
              className="w-40 h-24 object-cover rounded-md shadow"
            />
            <div className="flex items-center w-full">
              <div>
                <h3 className="font-semibold">{item.videoid?.title}</h3>
                <p className="text-sm text-gray-500">
                  {item.videoid?.views} views •{" "}
                  {formatTime(item.createdAt, time)}
                </p>
              </div>
              <div
                className="ml-auto opacity-0 group-hover:opacity-100 cursor-pointer px-2"
                onClick={(e) => {
                  e.stopPropagation()
                  setActiveMenu(item._id)
                }}
              >
                ⋮
              </div>
            </div>
            {activeMenu === item._id && (
              <div
                className="absolute right-2 top-8 bg-white shadow-md rounded p-2 text-sm z-50"
                onMouseLeave={() => setActiveMenu(null)}
              >
                <p
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(item._id)
                  }}
                  className="hover:bg-gray-100 p-1 rounded"
                >
                  <span className="text-gray-500 text-lg font-bold">✕         </span>
                  Remove from downloads
                </p>
              </div>
            )}
          </div>
        )})
      )}
    </div>
  )
}
export default Downloads