import {
  Home,
  Compass,
  PlaySquare,
  Clock,
  ThumbsUp,
  History,
  Download,
  User,
} from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { Button } from "./ui/button";
import Channeldialogue from "./channeldialogue";
import { useUser } from "@/lib/AuthContext";
const Sidebar = () => {
  const { user } = useUser();
  const [isdialogeopen, setisdialogeopen] = useState(false);
  return (
    <aside className="hidden md:block w-60 lg:w-64 bg-white dark:bg-black border-r h-[calc(100vh-56px)] sticky top-14 overflow-y-auto p-2">
      <nav className="space-y-1 py-2">
        <Link href="/">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
            <Home className="w-5 h-5 flex-shrink-0" />
            Home
          </Button>
        </Link>
        <Link href="/explore">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
            <Compass className="w-5 h-5 mr-3" />
            Explore
          </Button>
        </Link>
        <Link href="/subscriptions">
          <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
            <PlaySquare className="w-5 h-5 mr-3" />
            Subscriptions
          </Button>
        </Link>
        {user && (
          <>
            <div className="mt-3 border-t pt-3">
              <Link href="/history">
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
                  <History className="w-5 h-5 mr-3" />
                  History
                </Button>
              </Link>
              <Link href="/liked">
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
                  <ThumbsUp className="w-5 h-5 mr-3" />
                  Liked videos
                </Button>
              </Link>
              <Link href="/watch-later">
                <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
                  <Clock className="w-5 h-5 mr-3" />
                  Watch later
                </Button>
              </Link>
              <Link href="/downloads">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
                <Download className="w-5 h-5 mr-3"/>
             <span>Downloads</span>
                </Button>
              </Link>
              {user?.channelname ? (
                <Link href={`/channel/${user.id}`}>
                  <Button variant="ghost" className="w-full justify-start gap-3 rounded-xl cursor-pointer">
                    <User className="w-5 h-5 mr-3" />
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
          </>
        )}
      </nav>
      <Channeldialogue
        isopen={isdialogeopen}
        onclose={() => setisdialogeopen(false)}
        mode="create"
      />
    </aside>
  );
};
export default Sidebar;