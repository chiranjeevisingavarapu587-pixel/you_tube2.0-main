"use client";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    videoUrl: string;
    filepath: string;
  };
  nextVideoId?: string;
  toggleComments?: () => void;
}
export default function VideoPlayer({
  video,
  nextVideoId,
  toggleComments,
}: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const taps = useRef({
    left: 0,
    center: 0,
    right: 0,
  });
  const timers = useRef<{
    left: NodeJS.Timeout | null;
    center: NodeJS.Timeout | null;
    right: NodeJS.Timeout | null;
  }>({
    left: null,
    center: null,
    right: null,
  });
  const lastVideoTime = useRef(0);
  const watchedTime = useRef(0);
  const limitReached = useRef(false);
  const router = useRouter();
  const API_HOST =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
  const getWatchTimeKey = () => {
    const userId =
      typeof window !== "undefined"
        ? localStorage.getItem("userId") || "guest"
        : "guest";
    const today = new Date().toDateString();
    return `totalWatchTime_${userId}_${today}`;
  };
  const loadWatchTime = () => {
    if (typeof window === "undefined") return 0;
    const key = getWatchTimeKey();
    const saved = Number(localStorage.getItem(key) || "0");
    return saved;
  };
  const saveWatchTime = (time: number) => {
    if (typeof window === "undefined") return;
    const key = getWatchTimeKey();
    localStorage.setItem(
      key,
      String(Math.max(0, Math.floor(time)))
    );
  };
  const executeGesture = (
    area: "left" | "center" | "right",
    count: number
  ) => {
    if (!videoRef.current) return;
    switch (area) {
      case "left":
        if (count === 2) {
          videoRef.current.currentTime = Math.max(
            0,
            videoRef.current.currentTime - 10
          );
        } else if (count >= 3) {
          toggleComments?.();
        }
        break;
      case "center":
        if (count === 1) {
          if (videoRef.current.paused) {
            videoRef.current.play();
          } else {
            videoRef.current.pause();
          }
        } else if (count >= 3 && nextVideoId) {
          router.push(`/watch/${nextVideoId}`);
        }
        break;
      case "right":
        if (count === 2) {
          videoRef.current.currentTime += 10;
        } else if (count === 3) {
          if (confirm("Close website?")) {
            window.open("", "_self");
            window.close();
          }
        }
        break;
    }
  };
  const registerTap = (
    area: "left" | "center" | "right"
  ) => {
    if (timers.current[area]) {
      clearTimeout(timers.current[area]!);
    }
    taps.current[area]++;
    timers.current[area] = setTimeout(() => {
      executeGesture(area, taps.current[area]);
      taps.current[area] = 0;
      timers.current[area] = null;
    }, 300);
  };
  useEffect(() => {
    const plan =
      localStorage.getItem("plan") || "free";
    let limit = 300;
    if (plan === "bronze") {
      limit = 420;
    } else if (plan === "silver") {
      limit = 600;
    } else if (plan === "gold") {
      return;
    }
    watchedTime.current = loadWatchTime();
    console.log(
      "TOTAL WATCHED TIME:",
      watchedTime.current
    );
    console.log(
      "WATCH LIMIT:",
      limit
    );
    if (watchedTime.current >= limit) {
      limitReached.current = true;
      localStorage.setItem(
        `watchLimitReached_${plan}`,
        "true"
      );
      router.replace("/premium");
      return;
    }
    return () => {
      Object.values(timers.current).forEach(
        (timer) => {
          if (timer) {
            clearTimeout(timer);
          }
        }
      );
    };
  }, [router]);
  const handleTimeUpdate = (
    e: React.SyntheticEvent<HTMLVideoElement>
  ) => {
    const videoElement = e.currentTarget;
    const plan =
      localStorage.getItem("plan") || "free";
    if (plan === "gold") {
      return;
    }
    let limit = 300;
    if (plan === "bronze") {
      limit = 420;
    } else if (plan === "silver") {
      limit = 600;
    }
    if (limitReached.current) {
      videoElement.pause();
      return;
    }
    const currentTime =
      videoElement.currentTime;
    const previousTime =
      lastVideoTime.current;
    const difference =
      currentTime - previousTime;
    if (
      difference > 0 &&
      difference < 2
    ) {
      watchedTime.current += difference;
      saveWatchTime(
        watchedTime.current
      );
    }
    lastVideoTime.current =
      currentTime;
    console.log(
      "TOTAL WATCHED TIME:",
      watchedTime.current
    );
    console.log(
      "LIMIT:",
      limit
    );
    if (
      watchedTime.current >= limit
    ) {
      limitReached.current = true;
      videoElement.pause();
      saveWatchTime(limit);
      localStorage.setItem(
        `watchLimitReached_${plan}`,
        "true"
      );
      alert("Watch limit reached!");
      router.replace("/premium");
    }
  };
  useEffect(() => {
    lastVideoTime.current = 0;

    if (videoRef.current) {
      lastVideoTime.current =
        videoRef.current.currentTime;
    }
  }, [video._id]);
  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video overflow-hidden rounded-xl bg-black shadow-lg"
    >
      <video
        ref={videoRef}
        className="h-full w-full bg-black object-contain"
        controls
        poster=""
        onTimeUpdate={handleTimeUpdate}
        onSeeked={() => {
          if (videoRef.current) {
            lastVideoTime.current =
              videoRef.current.currentTime;
          }
        }}
      >
        <source
          src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/stream/${video?.videoUrl}`}
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div
          className="flex h-full"
          onPointerUp={(e) => {
            if (!containerRef.current) return;
            const rect = containerRef.current.getBoundingClientRect();
            const controlAreaHeight = 72;
            if (
              e.clientY >
              rect.bottom - controlAreaHeight
            ) {
              return;
            }
            const x = e.clientX - rect.left;
            if (
              x < rect.width / 3
            ) {
              registerTap("left");
            } else if (
              x >
              (rect.width * 2) / 3
            ) {
              registerTap("right");
            } else {
              registerTap("center");
            }
          }}
          style={{
            pointerEvents: "auto",
          }}
        />
      </div>
    </div>
  );
}