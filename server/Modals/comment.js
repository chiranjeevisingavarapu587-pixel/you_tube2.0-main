import mongoose from "mongoose";
const commentschema = mongoose.Schema(
  {
    userid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    videoid: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "videofiles",
      required: true,
    },
    commentbody: { type: String },
    usercommented: { type: String },
    parentId:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"comment",
      defaault:null
    },
    city: String,
    pinned:{type: Boolean, default: false},
    commentedon: { type: Date, default: Date.now },
    likes:{type:Number,default: 0},
    dislikes:{type:Number,default: 0},
  },
  {
    timestamps: true,
  }
);
export default mongoose.model("comment", commentschema);