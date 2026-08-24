import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
interface RelatedVideosProps {
  videos: Array<{
    _id: string;
    videotitle: string;
    videochannel: string;
    views: number;
    createdAt: string;
  }>;
}
const vid = "/video/vdo.mp4";
export default function RelatedVideos({ videos }: RelatedVideosProps) {
  return (
    <div className="space-y-3">
      {videos.map((video) => (
        <Link
          key={video._id}
          href={`/watch/${video._id}`}
          className="group flex gap-3 rounded-xl p-2 transition hover:bg-gray-100 dark:hover:bg-neutral-800"
        >
          <div className="relative aspect-video w-36 sm:w-40 overflow-hidden rounded-xl bg-gray-100 dark:bg-neutral-800 flex-shrink-0">
            <video
              src={vid}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-semibold transition-colors group-hover:text-blue-600">
              {video.videotitle}
            </h3>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">{video.videochannel}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {video.views.toLocaleString()} views •{" "}
              {video?.createdAt ? formatDistanceToNow(new Date(video.createdAt)) + " ago":""}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}