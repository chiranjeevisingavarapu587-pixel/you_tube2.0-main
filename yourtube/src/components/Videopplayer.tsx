"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
interface VideoPlayerProps {
  video: {
    _id: string;
    videotitle: string;
    videoUrl: string;
    filepath: string;
  };
  nextVideoId?: string;
  toggleComments?: ()=> void;
}
export default function VideoPlayer({ video, nextVideoId, toggleComments, }: VideoPlayerProps) {
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
  const router = useRouter();
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
      } else if (count == 3) {
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
  const currentPlan =
    typeof window !== "undefined"
      ? localStorage.getItem("plan") || "free"
      : "free";
  useEffect(() => {
    const today=new Date().toDateString();
      const savedDate=localStorage.getItem("watchLimitDate");
      if(savedDate !== today){
        localStorage.setItem("watchLimitDate", today);
        localStorage.removeItem("watchLimitReached_free");
        localStorage.removeItem("watchLimitReached_bronze");
        localStorage.removeItem("watchLimitReached_silver");
      }
    if (currentPlan !== "gold" && localStorage.getItem(`watchLimitReached_${currentPlan}`) === "true") {
      router.replace("/premium");
    }
    return ()=> {
      Object.values(timers.current).forEach((timer)=>{
        if (timer) clearTimeout(timer);
      });
    };
  }, [currentPlan, router]);
  return (
    <div 
    ref= {containerRef}
    className="relative w-full aspect-video overflow-hidden rounded-xl bg-black shadow-lg">
      <video
        ref={videoRef}
        className="h-full w-full bg-black object-contain"
        controls
        poster=""
        onTimeUpdate={(e: any) => {
          const plan = localStorage.getItem("plan") || "free";
          let limit = 300;
          if (plan === "bronze") {
            limit = 420;
          } else if (plan === "silver") {
            limit = 600;
          } else if (plan === "gold") {
            return;
          }
          console.log("CURRENT TIME:", e.target.currentTime);
          console.log("LIMIT:", limit);
          if (e.target.currentTime >= limit) {
            e.target.pause();
            localStorage.setItem(
              `watchLimitReached_${plan}`,
              "true"
            );
            e.target.currentTime = 0;
            alert("Watch limit reached!");
            router.replace("/premium");
          }
        }}
      >
        <source
  src={`http://localhost:5000/video/stream/${video?.videoUrl}`}
  type="video/mp4"
/>
        Your browser does not support the video tag.
      </video>
      <div
  className="absolute inset-0 z-10 pointer-events-none"
>
  <div
    className="flex h-full"
    onPointerUp={(e) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const controlAreaHeight = 72;
      if (e.clientY > rect.bottom - controlAreaHeight) {
        return;
      }
      const x = e.clientX - rect.left;
      if (x < rect.width / 3) {
        registerTap("left");
      } else if (x > (rect.width * 2) / 3) {
        registerTap("right");
      } else {
        registerTap("center");
      }
    }}
    style={{ pointerEvents: "auto" }}
  />
</div>
    </div>
  );
}