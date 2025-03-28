import express from "express";
import QRCode from "../models/QRCode.js";

const router = express.Router();

router.post("/addQrcode", async (req, res) => {
  const { userId, qrcodeurl, qrcodeName } = req.body;
  if (!userId || !qrcodeurl) {
    return res.status(400).json({ error: "User ID and QR code are required" });
  }
  try {
    const newQRCode = await QRCode.create({
      user: userId, // map userId from frontend to user field in model
      imageUrl: qrcodeurl, // map qrcodeurl to imageUrl
      qrcodeName: qrcodeName, // add qrcodeName if provided
    });
    res.status(201).json({ success: true, data: newQRCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
