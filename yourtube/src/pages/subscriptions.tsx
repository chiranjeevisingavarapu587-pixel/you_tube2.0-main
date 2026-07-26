import { useRouter } from "next/router";
export default function Subscriptions() {
  const router = useRouter();
  const channels = [
    {
      name: "Tech World",
      category: "Technology",
    },
    {
      name: "Gaming Hub",
      category: "Gaming",
    },
    {
      name: "Music Beats",
      category: "Music",
    },
    {
      name: "Movie Central",
      category: "Movies",
    },
  ];
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6">Subscriptions</h1>
      <div className="space-y-4">
        {channels.map((channel, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-gray-100 p-4 rounded-lg hover:bg-gray-200"
          >
            <div>
              <h2 className="font-semibold">{channel.name}</h2>
              <p className="text-sm text-gray-600">{channel.category}</p>
            </div>
            <button
              onClick={() =>
                router.push(`/search?q=${channel.category.toLowerCase()}`)
              }
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
            >
              View Videos
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}