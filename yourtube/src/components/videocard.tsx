"use client";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
export default function VideoCard({ video }: any) {
  return (
    <Link href={`/watch/${video?._id}`} className="group block">
      <div className="space-y-3">
        {/* Thumbnail */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-gray-100 dark:bg-neutral-800">
          <img
            src={`/video/${video?.thumbnail}`}
            alt={video?.title || "Video"}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute bottom-2 right-2 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white">
            00:07
          </div>
        </div>
        {/* Video Info */}
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold text-black dark:text-white group-hover:text-blue-600">
            {video?.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-gray-600 dark:text-gray-400">
            {video?.description}
          </p>
          <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">
            {video?.views?.toLocaleString() || 0} views
            {" • "}
            {video?.createdAt
              ? formatDistanceToNow(new Date(video.createdAt)) + " ago"
              : "Just now"}
          </p>
        </div>
      </div>
    </Link>
  );
}