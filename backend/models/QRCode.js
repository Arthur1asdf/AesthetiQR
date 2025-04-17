import mongoose from "mongoose";

const QRcodeSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  imageUrl: {
    // Corresponds to qrcodeurl from the route
    type: String,
    required: true,
  },
  qrcodeName: {
    // New field for the name
    type: String,
    required: true, // or true if you want it to be required
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("QRcode", QRcodeSchema);
