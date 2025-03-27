import mongoose from "mongoose";

const ProfilePicSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", required: true 
  },
  imageUrl: { 
    type: String, required: true 
  },
  uploadedAt: { 
    type: Date, 
    default: Date.now 
  },
});

export default mongoose.model("ProfilePic", ProfilePicSchema);
