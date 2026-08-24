"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical, X } from "lucide-react"
import axiosInstance from "@/lib/axiosInstance"
import { useUser } from "@/lib/AuthContext"
export default function LikedVideosContent() {
  const [likedVideos, setLikedVideos] = useState<any[]>([]);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user } = useUser()
  useEffect(() => {
    if (user) {
      loadLikedVideos()
    }
  }, [user])
  const loadLikedVideos = async () => {
    try {
      const res = await axiosInstance.get(`/likes/${user?._id}`);
      setLikedVideos(res.data || [])
    } catch (error) {
      console.log("Error loading liked videos", error)
    }
  };
  const handleUnlikeVideo = async (videoid: string, likeId: string) => {
    try {
      await axiosInstance.delete(`/likes/${videoid}`, {
        data: {
          userId:user?._id
        }
      })
      setLikedVideos((prev) =>
        prev.filter((item) => item._id !== likeId)
      )
    } catch (error) {
      console.log("Error removing like", error)
    }
  }
  return (
    <div className="p-4 sm:p-6">
      <h1 className="text-2xl font-semibold mb-4 sm:mb-6">Liked videos</h1>

      <div className="space-y-2">
        {likedVideos
        .filter((item: any)=> item.videoid)
        .map((item: any) => (
          <div
            key={item._id}
            className="flex w-full min-w-0 gap-2 sm:gap-4 group"
          >
            {/* Thumbnail */}
            <Link
              href={`/watch/${item.videoid?._id}`}
              className="flex-shrink-0"
            >
              <div className="relative w-28 sm:w-40 aspect-video bg-gray-100 rounded overflow-hidden">
                <img
                  src={`/video/${item.videoid.thumbnail}`}
                  alt="thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
            </Link>

            {/* Details */}
            <div className="flex-1 min-w-0 pr-1">
              <Link href={`/watch/${item.videoid?._id}`}>
                <h3 className="font-medium text-sm sm:text-base line-clamp-2 break-words">
             {item.videoid?.title}
              </h3>
              </Link>
              <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                {item.videoid?.views?.toLocaleString() || 0} views •{" "}
                {item.videoid?.createdAt &&
                !isNaN(new Date(item.videoid.createdAt).getTime())
                ? formatDistanceToNow(
                  new Date(item.videoid.createdAt),
                  { addSuffix: true }
                  )
                  : "Recently"}
              </p>

              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Liked{" "}
                {item.createdAt
                  ? formatDistanceToNow(
                      new Date(item.createdAt),
                      { addSuffix: true }
                    )
                  : "Recently"}
              </p>
            </div>
            {/* Dropdown */}
            <DropdownMenu
  open={openMenu === item._id}
  onOpenChange={(open) =>
    setOpenMenu(open ? item._id : null)
}
>
  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="flex-shrink-0 opacity-100"
    >
      <MoreVertical className="w-4 h-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <div className="flex items-center gap-4 px-2 py-1">
      <button
        type="button"
        onClick={() => setOpenMenu(null)}
        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        <X className="w-5 h-5" />
      </button>
      {/* Remove - Unlike video */}
      <button
        type="button"
        onClick={() => {
          handleUnlikeVideo(
            item.videoid?._id,
            item._id
          )
          setOpenMenu(null)
        }}
        className="whitespace-nowrap rounded px-1 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Remove from liked videos
      </button>
    </div>
  </DropdownMenuContent>
</DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  )
}