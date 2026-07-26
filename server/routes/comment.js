import express from "express";
import axios from "axios";
import Comment from '../Modals/comment.js';
import { deletecomment, getallcomment, postcomment, likecomment, editcomment, dislikeComment, replycomment} from "../controllers/comment.js";
const routes = express.Router();
routes.get("/:videoid", getallcomment);
routes.post("/postcomment", postcomment);
routes.post("/reply", replycomment);
routes.delete("/deletecomment/:id", deletecomment);
routes.patch("/editcomment/:id", editcomment);
routes.patch("/like/:id", likecomment);
routes.patch("/dislike/:id", dislikeComment);
routes.patch("/pin/:id", async (req,res)=>{
 try{
  const comment = await Comment.findById(req.params.id);
  if(!comment){
    return res.status(404).json({message:"Comment not found"});
  }
  comment.pinned = !comment.pinned;
  await comment.save();
  res.json(comment);
 }catch(err){
  res.status(500).json(err);
 }
});
routes.post("/translate", async (req, res) => {
try {
const { text } = req.body
const response = await axios.get(
`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=te|en`
)
res.status(200).json({
translatedText: response.data.responseData.translatedText
})
} catch (error) {
console.log("Translation error:", error.message)
res.status(500).json({
message: "Translation failed"
})
}
})
export default routes;