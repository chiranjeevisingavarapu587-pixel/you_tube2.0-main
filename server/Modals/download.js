import mongoose from "mongoose"
const downloadSchema = new mongoose.Schema({
   userId:{
      type:String,
      required:true
   },
   videoid:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"videofiles",
      required:true
   }
},{timestamps:true})
export default mongoose.model("Download",downloadSchema)