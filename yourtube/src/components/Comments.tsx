import React, { useEffect, useState } from "react";
import axiosInstance from "@/lib/axiosInstance";
import { useUser } from "@/lib/AuthContext";
import { ThumbsUp, ThumbsDown } from "lucide-react";
interface Comment {
  _id: string;
  videoid: string;
  parentId?:string;
  commentbody: string;
  usercommented: string;
  city?: string;
  createdAt?: string;
  commenton?: string;
  pinned?: boolean;
  likes: number;
  dislikes: number;
}
const getCity=async()=>{
  try{
    const res=await fetch("https://ipapi.co/json/");
    const data=await res.json();
    return data.city;
  }catch{
    return "Unknown";
  }
};
const formatTime = (date:any) => {
  if(!date) return "";
  const commentDate = new Date(date);
  const now = new Date();
  const diff = Math.floor((now.getTime() - commentDate.getTime()) / 1000);
  if (diff < 60) return "Just now";
  if (diff < 3600) return Math.floor(diff / 60) + " min ago";
  if (diff < 86400) return Math.floor(diff / 3600) + " hr ago";
  return Math.floor(diff / 86400) + " days ago";
};
const Comments = ({ videoId, onHide, }: {videoId: string; onHide: ()=> void;}) => {
const [sortType, setSortType]=useState("top")
const [openReplies,setOpenReplies]=useState<any>({})
const [showReplies, setShowReplies]=useState<{[key:string]:boolean}>({})
const [editingId, setEditingId]=useState<string | null>(null)
const [editedText, setEditedText]=useState("")
const [replyId, setReplyId]=useState<string | null>(null)
const [replyText, setReplyText]=useState("")
const startEdit=(comment:any)=>{
  setEditingId(comment._id)
  setEditedText(comment.commentbody)
}
  const { user } = useUser();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const handlePin = async (commentId:string) => {
  try{
    await axiosInstance.patch(`/comment/pin/${commentId}`);
    setComments(prev =>
      prev.map((c:any) =>
        c._id === commentId
          ? { ...c, pinned: !c.pinned }
          : c
      )
    );
  }catch(error){
    console.log(error);
  }
};
const handleReply = async(parentId:string)=>{
 try{
  const res = await axiosInstance.post("/comment/reply",{
   commentbody:replyText,
   videoId:videoId,
   parentId:parentId,
   userid:user?._id,
   usercommented:user?.name
  })
  setComments(prev=>[...prev,res.data])
  setReplyText("")
  setReplyId(null)
 }
 catch(error){
  console.log(error)
 }
}
  const [translatedText, setTranslatedText] = useState<any>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const loadComments = async () => {
      try {
        const res = await axiosInstance.get(`/comment/${videoId}`);
        const sorted=res.data.sort((a:any,b:any)=>{
        if(a.pinned===b.pinned) return 0;
        return a.pinned ? -1:1;
        });
        setComments(sorted);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (videoId) loadComments();
  }, [videoId]);
  const handleSubmitComment = async (e:any) => {
    e.preventDefault();
    const city=await getCity();
    console.log("City:",city);
    if (!newComment.trim()) return;
    const specialChars = /[!@#$%^&*(),.?":{}|<>]/;
    if (specialChars.test(newComment)) {
      alert("Special characters are not allowed in comments");
      return;
    }
    try {
      const res = await axiosInstance.post("/comment/postcomment", {
        videoid: videoId,
        userid: user._id,
        usercommented: user.name,
        city: city,
        commentbody: newComment,
      });
      if (res.data) {
        setComments([res.data, ...comments]);
        setNewComment("");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id:string) => {
 try {
   await axiosInstance.delete(`/comment/deletecomment/${id}`);

   setComments(prev => prev.filter(c => c._id !== id));
 } catch (error) {
   console.log(error);
 }
};
  const handleEdit=async(id:string)=>{
    try{
      const res=await axiosInstance.patch(`/comment/editcomment/${id}`,{commentbody:editedText})
      setComments(prev=>
        prev.map(c=>c._id===id ? res.data:c)
      )
      setEditingId(null)
    }catch(error){
      console.log(error)
    }
  }
  const handleLike = async (commentId:string) => {
    try {
      await axiosInstance.patch(`/comment/like/${commentId}`);
      setComments((prev)=>
        prev.map((c)=>
          c._id === commentId
          ? { ...c, likes: c.likes + 1 }
          : c
        )
      );
    } catch (error) {
      console.log(error);
    }
  };
  const handleDislike = async (commentId:string) => {
    try {
      await axiosInstance.patch(`/comment/dislike/${commentId}`);
      setComments((prev)=>
        prev
          .map((c)=>
            c._id === commentId
            ? { ...c, dislikes: c.dislikes + 1 }
            : c
          )
          .filter((c)=> c.dislikes < 2)   // auto delete after 2 dislikes
      );
    } catch (error) {
      console.log(error);
    }
  };
  const translateComment = async (commentId:string, text:string) => {
    try {
      const res = await axiosInstance.post("/comment/translate", {
        text: text
      });
      const data = res.data;
      setTranslatedText((prev:any)=>({
        ...prev,
        [commentId]: data.translatedText
      }));
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) return <div>Loading comments...</div>;
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">
    {comments.length} Comments
  </h2>
  <button
    onClick={onHide}
    className="text-sm text-blue-500 hover:underline"
  >
    Hide
  </button>
</div>
      <div className="flex gap-4 mb-3 text-sm">
        <button
        onClick={()=>setSortType("top")}
        className={sortType==="top" ? "font-semibold" : ""}>
          Top comments
        </button>
        <button
        onClick={()=>setSortType("new")}
        className={sortType==="new" ? "font-semibold" : ""}>
          Newest first
        </button>
      </div>
      {user && (
        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e)=>setNewComment(e.target.value)}
            className="border p-2 flex-1 rounded"
          />
          <button
            type="submit"
            className="text-black px-6 py-4 rounded-full bg-gray-100 border border-gray-500"
          >
            Comment
          </button>
        </form>
      )}
      <div className="w-full space-y-4">
        {[...comments]
        .filter((c)=>!c.parentId)
        .sort((a,b)=>{
          if(a.pinned && !b.pinned) return -1
          if(!a.pinned && b.pinned) return 1
          if(sortType==="new"){
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          }
          return (b.likes || 0)-(a.likes || 0)
        })
        .map((comment)=>{
          const replyCount=
        comments.filter((c)=>c.parentId===comment._id).length
        return (
          <div key={comment._id} className= {`border-b pb-3 ${comment.pinned? "bg-yellow-50":""}`}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-gray-400 text-white flex items-center justify-center text-sm font-semibold">
                {comment.usercommented?.charAt(0)}
                </div>
                </div>
            <p className="font-medium">
              {comment.usercommented}
              {comment.city && (
                <span className="ml-2 text-xs text-gray-500">({comment.city})
                </span>
              )}
              {comment.pinned && (
                <span className="px-2 py-1 text-xs text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition">📌 Pinned</span>
              )}
            </p>
            <button
                onClick={() => handleDelete(comment._id)}
                className="px-2 py-1 text-xs text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded transition"
                >
                Delete
            </button>
            <button
            onClick={()=>startEdit(comment)}
            className="text-gray-500 hover:text-blue-500 text-xs ml-3 transition">
              Edit
            </button>
            <button
            onClick={()=>setReplyId(comment._id)}
            className="text-gray-500 hover:text-blue-500 text-xs ml-3">
              Reply
            </button>
            
            <p className="text-xs text-gray-500">
              {comment.city}.
              {formatTime(comment.createdAt)}
            </p>
           {editingId === comment._id ? (
  <>
    <input
      value={editedText}
      onChange={(e)=>setEditedText(e.target.value)}
      className="border p-1 text-sm"
    />
    <button
      onClick={()=>handleEdit(comment._id)}
      className="text-blue-500 text-xs ml-2"
    >
      Save
    </button>
  </>
) : (
  <p className="text-sm text-gray-700">
    {comment.commentbody}
    </p>
)}
{replyCount>0 && (
              <button
              onClick={()=>
                setShowReplies((prev)=>({
                  ...prev, [comment._id]: ! prev[comment._id]
                }))
              }
              className="text-blue-1000 text-xs ml-3">
               {showReplies[comment._id] ? "Hide replies" : `View replies (${replyCount})`}
              </button>
            )}
            {replyId === comment._id && (
  <div className="ml-6 mt-2">
    <input
      value={replyText}
      onChange={(e)=>setReplyText(e.target.value)}
      placeholder="Write a reply..."
      className="border p-1 text-sm"
    />

    <button
      onClick={()=>handleReply(comment._id)}
      className="text-blue-500 text-xs ml-2"
    >
      Post
    </button>
  </div>
)}
            {showReplies[comment._id] &&
            comments
            .filter((c)=>c.parentId===comment._id)
            .map((reply)=>(
              <div key={reply._id} className="ml-8 mt-2 text-sm">
                <p className="font-semibold">
                  ↳ {reply.usercommented}
                </p>
                <p>
                  {reply.commentbody}
                </p>
              </div>
            ))}
            {translatedText[comment._id] && (
              <p className="text-sm text-green-600">
               Translated: {translatedText[comment._id]}
              </p>
            )}
            <div className="flex gap-4 text-sm mt-2 items-center">
              <button
                onClick={()=>handleLike(comment._id)}
                className="flex items-center gap-1 hover:text-black"
              >
                <ThumbsUp size={16} />
                {comment.likes || 0}
              </button>
              <button
              onClick={()=>handlePin(comment._id)}
              className="text-red-500 text-xs ml-2">📌 Pin</button>
              <button
                onClick={()=>handleDislike(comment._id)}
                className="flex items-center gap-1 hover:text-black"
              >
                <ThumbsDown size={16} />
                {comment.dislikes || 0}
              </button>
              <button
                onClick={()=>translateComment(comment._id, comment.commentbody)}
                className="text-blue-500"
              >
              🌐 Translate to English
              </button>
            </div>
          </div>
        )
})
}
      </div>
    </div>
  );
};
export default Comments;