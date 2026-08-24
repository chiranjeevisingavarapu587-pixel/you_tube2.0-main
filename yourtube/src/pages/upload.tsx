import { useState } from "react";
import axios from "axios";
export default function Upload() {
  const [title, setTitle] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const handleUpload = async () => {
    if (!video || !thumbnail){
        alert("Select files");
        return;
    }
    const formData = new FormData();
    formData.append("videotitle", title);
    formData.append("videochannel", "My Channel");
    formData.append("uploader", "Chiru");
    formData.append("file", video);
    formData.append("thumbnail", thumbnail);
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_URL}/video/upload`,
        formData
      );
      console.log(res.data);
      alert("Upload success");
    } catch (err) {
      console.log(err);
      alert("Upload failed");
    }
  };
  return (
    <div style={{ padding: "20px" }}>
      <h1>Upload Video</h1>
      <input
        type="text"
        placeholder="Video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <br /><br />
      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => 
                setVideo(e.target.files?.[0] || null)}
      />
      <br /><br />
      <input
        type="file"
        accept="image/*"
        onChange={(e) =>
                setThumbnail(e.target.files?.[0] || null)}
      />
      <br /><br />
      <button onClick={handleUpload}>
        Upload
      </button>
    </div>
  );
}