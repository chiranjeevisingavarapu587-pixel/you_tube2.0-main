import mongoose from "mongoose"
const userSchema=new mongoose.Schema({
    name:String,
    email:String,
    mobile:{
        type: String,
        default:""
    },
    otp:{
        type: String,
        default:""
    },
    plan:{
        type:String,
        enum:["free", "bronze", "silver", "gold"],
        default:"free"
    },
    premiumExpiry:{
        type:Date,
        default:null
    }
})
export default mongoose.model("User", userSchema)