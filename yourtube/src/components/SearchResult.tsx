import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import axiosInstance from "@/lib/axiosInstance";
const SearchResult = ({ query }: any) => {
  const [videos, setVideos] = useState<any[]>([]);
  useEffect(() => {
    if (!query) return;
    const fetchVideos = async () => {
      try {
        const res = await axiosInstance.get(
  `/video/search?q=${encodeURIComponent(query)}`);
setVideos(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchVideos();
  }, [query]);
  if (!videos.length) {
    return (
      <div className="text-center py-12">
        <h2 className="text-xl font-semibold mb-2">No results found</h2>
        <p className="text-gray-500">
          Try different keywords or remove search filters
        </p>
      </div>
    );
  }
  return (
    <div className="space-y-6">
      {videos.map((video: any) => (
        <div key={video._id} className="flex w-full min-w-0 gap-2 sm:gap-4">
  <Link href={`/watch/${video._id}`} className="flex-shrink-0">
    <img
      src={`/video/${video.thumbnail}`}
      alt={video.title}
      className="w-28 h-20 sm:w-64 sm:h-auto object-cover rounded-lg cursor-pointer"
    />
  </Link>
          <div className="min-w-0 flex-1">
            <Link href={`/watch/${video._id}`}>
              <h3 className="text-sm sm:text-lg font-semibold cursor-pointer line-clamp-2 break-words">
                {video.title}
              </h3>
            </Link>
            <p className="text-xs sm:text-sm text-gray-600 truncate">
              {video.views} views •{" "}
              {video.createdAt &&
                formatDistanceToNow(new Date(video.createdAt))}{" "}
              ago
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};
export default SearchResult;