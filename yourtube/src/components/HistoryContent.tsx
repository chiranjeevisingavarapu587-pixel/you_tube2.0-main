"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { formatDistanceToNow } from "date-fns";
import { MoreVertical, X, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import axiosInstance from "@/lib/axiosInstance";
import { useUser } from "@/lib/AuthContext";

export default function HistoryContent() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const { user } = useUser();
  console.log(user?._id)
  useEffect(() => {
    if (user) {
      loadHistory();
    }
  }, [user]);

  const loadHistory = async () => {
    if (!user) return;

    try {
      const historyData = await axiosInstance.get(`/history/user/${user?._id}`);
      setHistory(historyData.data);
      console.log(historyData.data)
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  };
  if (loading) {
    return <div>Loading history...</div>;
  }
  const handleRemoveFromHistory = async (historyId: string) => {
    try {
      console.log("Removing from history:", historyId);

      setHistory(history.filter((item) => item._id !== historyId));
    } catch (error) {
      console.error("Error removing from history:", error);
    }
  };

  if (!user) {
    return <div>Please login</div>;
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">
          Keep track of what you watch
        </h2>
        <p className="text-gray-600">
          Watch history isn't viewable when signed out.
        </p>
      </div>
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <Clock className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No watch history yet</h2>
        <p className="text-gray-600">Videos you watch will appear here.</p>
      </div>
    );
  }
  const videos = "/video/vdo.mp4";
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600">{history.length} videos</p>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div key={item._id} className="flex w-full min-w-0 items-start gap-2 sm:gap-4 group">
            <Link href={item.videoid?._id ? `/watch/${item.videoid._id}`:"#"} className="flex min-w-0 flex-1">
             <div className="flex min-w-0 gap-2 sm:gap-4 mb-4">
              {/* Thumbnail */}
              {item.videoid?.thumbnail && (
              <img
              src={`/video/${item.videoid.thumbnail}`}
              className="w-28 h-20 sm:w-40 sm:h-24 object-cover rounded flex-shrink-0"
              />
              )}
              {/* Video Details */}
              <div className="flex flex-col min-w-0 flex-1">
              <h3 className="font-medium text-sm sm:text-base line-clamp-2 break-words">
             {item.videoid?.title}
              </h3>
              <p className="text-xs text-gray-500 truncate">
              {item.videoid?.views?.toLocaleString()} views •{" "}
              {item.videoid?.updatedAt ? formatDistanceToNow(new Date(item.videoid.updatedAt)): "Recently"} ago
              </p>
              </div>
              </div>
               </Link>
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
      {/* Remove - Remove from history */}
      <button
        type="button"
        onClick={() => {
          handleRemoveFromHistory(item._id);
          setOpenMenu(null);
        }}
        className="whitespace-nowrap rounded px-1 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
      >
        Remove from watch history
      </button>
    </div>
  </DropdownMenuContent>
</DropdownMenu>
          </div>
        ))}
      </div>
    </div>
  );
}