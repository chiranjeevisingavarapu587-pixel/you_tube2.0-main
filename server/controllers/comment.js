import comment from "../Modals/comment.js"
import mongoose from "mongoose"
import axios from "axios"
export const postcomment = async (req, res) => {
  const commentdata = req.body
  try {
    const postcomment = new comment(commentdata)
    await postcomment.save()
    res.status(200).json(postcomment)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}
export const getallcomment = async (req, res) => {
  try {
    const commentlist = await comment.find({ videoid: req.params.videoid })
    res.status(200).json(commentlist)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}
export const deletecomment = async (req, res) => {
  const { id } = req.params
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).send("comment unavailable")
  try {
    await comment.findByIdAndDelete(id)
    await comment.deleteMany({ parentId: id })
    res.status(200).json({ message: "deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}
export const likecomment = async (req, res) => {
  try {
    const data = await comment.findById(req.params.id)
    if (!data) return res.status(404).json({ message: "Comment not found" })
    data.likes = (data.likes || 0) + 1
    await data.save()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}
export const dislikecomment = async (req, res) => {
  try {
    const data = await comment.findById(req.params.id)
    if (!data) return res.status(404).json({ message: "Comment not found" })
    data.dislikes = (data.dislikes || 0) + 1
    if (data.dislikes >= 2) {
      await comment.findByIdAndDelete(req.params.id)
      return res.status(200).json({ message: "Comment deleted" })
    }
    await data.save()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}
export const translateComment = async (req, res) => {
  try {
    const { text } = req.body
    const response = await axios.get(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|en`
    )
    const translatedText = response.data.responseData.translatedText
    res.status(200).json({
      translatedText: translatedText
    })
  } catch (error) {
    console.log("Translation error:", error.message)
    res.status(500).json({ message: "Translation failed" })
  }
}
export const dislikeComment = async (req, res) => {
  try {
    const data = await comment.findById(req.params.id)
    if (!data) {
      return res.status(404).json({ message: "Comment not found" })
    }
    data.dislikes = (data.dislikes || 0) + 1
    if (data.dislikes >= 2) {
      await comment.findByIdAndDelete(req.params.id)
      return res.status(200).json({ message: "Comment deleted due to dislikes" })
    }
    await data.save()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" })
  }
}
export const editcomment = async (req, res) => {
 try {
   const { id } = req.params
   const { commentbody } = req.body
   const updatedComment = await comment.findByIdAndUpdate(
     id,
     { commentbody },
     { new: true }
   )
   res.status(200).json(updatedComment)
 } catch (error) {
   res.status(500).json({ message: "Something went wrong" })
 }
}
export const replycomment=async(req,res)=>{
  try{
    const {commentbody,videoId,parentId,usercommented,city,userid}=req.body
    const newReply=new comment({
    commentbody:commentbody,
    videoid:videoId,
    parentId:parentId,
    usercommented:usercommented || "User",
    city:city || "Unknown",
    userid:userid || null
    })
    const savedReply=await newReply.save()
    res.status(200).json(savedReply)
  }
  catch(error){
    console.log(error)
    res.status(500).json({message:"Something went wrong"})
  }
}