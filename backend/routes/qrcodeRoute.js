import express from "express";
import QRCode from "../models/QRCode.js";

const router = express.Router();

router.post("/addQrcode", async (req, res) => {
  const { userId, qrcodeurl, qrcodeName } = req.body;
  if (!userId || !qrcode) {
    return res.status(400).json({ error: "User ID and QR code are required" });
  }
  try {
    const newQRCode = await QRCode.create({ userId, qrcodeurl, qrcodeName });
    res.status(201).json({ success: true, data: newQRCode });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
