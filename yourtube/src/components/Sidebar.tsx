import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  Download,
  User,
  X,
} from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";

const Sidebar = () => {
  const { user } = useUser();

  const [isdialogeopen, setisdialogeopen] = useState(false);

  // Mobile sidebar state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Listen for hamburger click from Header
  useEffect(() => {
    const handleMobileSidebar = () => {
      setMobileOpen((prev) => !prev);
    };

    window.addEventListener(
      "toggle-mobile-sidebar",
      handleMobileSidebar
    );

    return () => {
      window.removeEventListener(
        "toggle-mobile-sidebar",
        handleMobileSidebar
      );
    };
  }, []);

  const closeMobileSidebar = () => {
    setMobileOpen(false);
  };

  return (
    <>
      {/* ================================================= */}
      {/* DESKTOP SIDEBAR - EXISTING STRUCTURE */}
      {/* ================================================= */}

      <aside className="hidden md:block w-60 lg:w-64 bg-white dark:bg-black border-r h-[calc(100vh-56px)] sticky top-14 overflow-y-auto p-2">
        <nav className="space-y-1 py-2">

          {/* HOME */}
          <Link href="/">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl cursor-pointer"
            >
              <Home className="w-5 h-5 flex-shrink-0" />
              Home
            </Button>
          </Link>

          {/* EXPLORE */}
          <Link href="/explore">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl cursor-pointer"
            >
              <Compass className="w-5 h-5 flex-shrink-0" />
              Explore
            </Button>
          </Link>

          {/* SUBSCRIPTIONS */}
          <Link href="/subscriptions">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 rounded-xl cursor-pointer"
            >
              <PlaySquare className="w-5 h-5 flex-shrink-0" />
              Subscriptions
            </Button>
          </Link>

          {/* USER OPTIONS */}
          {user && (
            <div className="mt-3 border-t pt-3">

              {/* HISTORY */}
              <Link href="/history">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl cursor-pointer"
                >
                  <History className="w-5 h-5 flex-shrink-0" />
                  History
                </Button>
              </Link>

              {/* LIKED */}
              <Link href="/liked">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl cursor-pointer"
                >
                  <ThumbsUp className="w-5 h-5 flex-shrink-0" />
                  Liked videos
                </Button>
              </Link>

              {/* WATCH LATER */}
              <Link href="/watch-later">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl cursor-pointer"
                >
                  <Clock className="w-5 h-5 flex-shrink-0" />
                  Watch later
                </Button>
              </Link>

              {/* DOWNLOADS */}
              <Link href="/downloads">
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3 rounded-xl cursor-pointer"
                >
                  <Download className="w-5 h-5 flex-shrink-0" />
                  Downloads
                </Button>
              </Link>

              {/* YOUR CHANNEL / CREATE CHANNEL */}
              {user?.channelname ? (
                <Link href={`/channel/${user._id}`}>
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-3 rounded-xl cursor-pointer"
                  >
                    <User className="w-5 h-5 flex-shrink-0" />
                    Your channel
                  </Button>
                </Link>
              ) : (
                <div className="px-2 py-1.5">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full rounded-xl"
                    onClick={() => setisdialogeopen(true)}
                  >
                    Create Channel
                  </Button>
                </div>
              )}
            </div>
          )}
        </nav>
      </aside>

      {/* ================================================= */}
      {/* MOBILE SIDEBAR */}
      {/* ================================================= */}

      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-[100]">

          {/* DARK OVERLAY */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={closeMobileSidebar}
          />

          {/* DRAWER */}
          <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] bg-white dark:bg-black shadow-2xl">

            {/* MOBILE SIDEBAR HEADER */}
            <div className="flex items-center justify-between h-14 px-4 border-b">

              <Link
                href="/"
                onClick={closeMobileSidebar}
                className="flex items-center gap-2"
              >
                <div className="bg-red-600 p-1 rounded">
  <span className="text-white font-bold text-sm">▶</span>
</div>
                <span className="text-xl font-medium">
                  YourTube
                </span>
              </Link>

              {/* CLOSE */}
              <Button
                variant="ghost"
                size="icon"
                onClick={closeMobileSidebar}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* MOBILE MENU */}
            <nav className="p-3 space-y-1 overflow-y-auto h-[calc(100%-56px)]">

              {/* HOME */}
              <Link
                href="/"
                onClick={closeMobileSidebar}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-4 rounded-xl h-12"
                >
                  <Home className="w-5 h-5" />
                  Home
                </Button>
              </Link>

              {/* EXPLORE */}
              <Link
                href="/explore"
                onClick={closeMobileSidebar}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-4 rounded-xl h-12"
                >
                  <Compass className="w-5 h-5" />
                  Explore
                </Button>
              </Link>

              {/* SUBSCRIPTIONS */}
              <Link
                href="/subscriptions"
                onClick={closeMobileSidebar}
              >
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-4 rounded-xl h-12"
                >
                  <PlaySquare className="w-5 h-5" />
                  Subscriptions
                </Button>
              </Link>

              {/* USER MENU */}
              {user && (
                <>
                  <div className="border-t my-3" />

                  {/* HISTORY */}
                  <Link
                    href="/history"
                    onClick={closeMobileSidebar}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-4 rounded-xl h-12"
                    >
                      <History className="w-5 h-5" />
                      History
                    </Button>
                  </Link>

                  {/* LIKED */}
                  <Link
                    href="/liked"
                    onClick={closeMobileSidebar}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-4 rounded-xl h-12"
                    >
                      <ThumbsUp className="w-5 h-5" />
                      Liked videos
                    </Button>
                  </Link>

                  {/* WATCH LATER */}
                  <Link
                    href="/watch-later"
                    onClick={closeMobileSidebar}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-4 rounded-xl h-12"
                    >
                      <Clock className="w-5 h-5" />
                      Watch later
                    </Button>
                  </Link>

                  {/* DOWNLOADS */}
                  <Link
                    href="/downloads"
                    onClick={closeMobileSidebar}
                  >
                    <Button
                      variant="ghost"
                      className="w-full justify-start gap-4 rounded-xl h-12"
                    >
                      <Download className="w-5 h-5" />
                      Downloads
                    </Button>
                  </Link>

                  {/* YOUR CHANNEL */}
                  {user?.channelname && (
                    <Link
                      href={`/channel/${user._id}`}
                      onClick={closeMobileSidebar}
                    >
                      <Button
                        variant="ghost"
                        className="w-full justify-start gap-4 rounded-xl h-12"
                      >
                        <User className="w-5 h-5" />
                        Your channel
                      </Button>
                    </Link>
                  )}

                  {/* CREATE CHANNEL */}
                  {!user?.channelname && (
                    <Button
                      variant="secondary"
                      className="w-full rounded-xl mt-2"
                      onClick={() => {
                        closeMobileSidebar();
                        setisdialogeopen(true);
                      }}
                    >
                      Create Channel
                    </Button>
                  )}
                </>
              )}
            </nav>
          </aside>
        </div>
      )}

      {/* CHANNEL DIALOG */}
      <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
    </>
  );
};

export default Sidebar;