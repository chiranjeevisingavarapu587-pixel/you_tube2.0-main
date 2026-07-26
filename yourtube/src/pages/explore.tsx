import { useRouter } from "next/router";
export default function Explore() {
  const router = useRouter();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Explore</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <div
          onClick={() => router.push("/search?q=trending")}
          className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 cursor-pointer"
        >
          🔥 Trending
        </div>
        <div
          onClick={() => router.push("/search?q=music")}
          className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 cursor-pointer"
        >
          🎵 Music
        </div>
        <div
          onClick={() => router.push("/search?q=gaming")}
          className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 cursor-pointer"
        >
          🎮 Gaming
        </div>
        <div
          onClick={() => router.push("/search?q=news")}
          className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 cursor-pointer"
        >
          📰 News
        </div>
        <div
          onClick={() => router.push("/search?q=movies")}
          className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 cursor-pointer"
        >
          🎬 Movies
        </div>
        <div
          onClick={() => router.push("/search?q=sports")}
          className="bg-gray-100 p-6 rounded-lg text-center hover:bg-gray-200 cursor-pointer"
        >
          ⚽ Sports
        </div>
      </div>
    </div>
  );
}