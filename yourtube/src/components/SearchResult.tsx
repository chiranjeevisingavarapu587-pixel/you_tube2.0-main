import React, { useEffect, useState } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
const SearchResult = ({ query }: any) => {
  const [videos, setVideos] = useState<any[]>([]);
  useEffect(() => {
    if (!query) return;
    const fetchVideos = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/video/search?q=${query}`
        );
        const data = await res.json();
        setVideos(data);
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
        <div key={video._id} className="flex gap-4">
          <div>
            <img
            src={`/video/${video.thumbnail}`}
            alt={video.title}
              className="w-64 rounded-lg"
            />
          </div>
          <div>
            <Link href={`/watch/${video._id}`}>
              <h3 className="text-lg font-semibold cursor-pointer">
                {video.title}
              </h3>
            </Link>
            <p className="text-sm text-gray-600">
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