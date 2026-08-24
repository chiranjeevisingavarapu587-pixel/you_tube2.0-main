import Header from "@/components/Header";
import FloatingCall from "@/components/FloatingCall";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { ThemeProvider } from "../lib/theme-provider";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "@/components/ui/sonner";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import { UserProvider } from "../lib/AuthContext";
import { CallProvider } from "@/lib/CallContext";
import { minutesInHour } from "date-fns/constants";
import { socket } from "@/lib/socket";
export default function App({ Component, pageProps }: AppProps) {
  const router=useRouter();
  const isCallPage=router.pathname.startsWith("/call/");
  useEffect(() => {
    console.log("APP TSX RUNNING");
  const setTheme = async () => {
    const hour = new Date().getHours();
    if (hour >= 10 && hour < 12) {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        console.log("Region:", data.region);
        console.log("Time:", hour);
        const southStates = [
          "Andhra Pradesh",
          "Telangana",
          "Tamil Nadu",
          "Karnataka",
          "Kerala",
        ];

        if (southStates.includes(data.region)) {
          document.documentElement.classList.remove("dark");
        } else {
          document.documentElement.classList.add("dark");
        }
      } catch (err) {
        document.documentElement.classList.add("dark");
      }
    } else {
      document.documentElement.classList.add("dark");
    }
  };
  setTheme();
}, []);
useEffect(() => {
  console.log("Socket Connected?", socket.connected);
  console.log("Socket ID:", socket.id);
  if (socket.connected) {
    console.log("Already Connected:", socket.id);
  }
  socket.on("connect", () => {
    console.log("Socket Connected Event:", socket.id);
  });
  socket.on("disconnect", () => {
    console.log("Socket Disconnected");
  });
  return () => {
    socket.off("connect");
    socket.off("disconnect");
  };
}, []);
  return (
    <ThemeProvider attribute="class"
    defaultTheme="light"
    enableSystem={false}>
      <CallProvider>
    <UserProvider>
      <div className="min-h-screen bg-white text-black dark:bg-black dark:text-white overflow-x-hidden">
        <Toaster />

{isCallPage ? (
  <Component {...pageProps} />
) : (
  <>
    <Header />

    <div className="flex">
      <Sidebar />

      <main className="flex-1 min-w-0 overflow-x-hidden">
        <Component {...pageProps} />
      </main>
    </div>

    <FloatingCall />
  </>
)}
        </div>
    </UserProvider>
    </CallProvider>
    </ThemeProvider>
  );
}