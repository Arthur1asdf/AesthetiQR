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

router.get("/searchQrcode", async (req, res) => {
  // Get search parameters from the query string
  const { userId, qrcodeName } = req.query;
  let filter = {};

  // If a userId is provided, filter by that user
  if (userId) {
    filter.user = userId;
  }

  // If a qrcodeName is provided, do a case-insensitive regex search
  if (qrcodeName) {
    filter.qrcodeName = { $regex: new RegExp(qrcodeName, "i") };
  }

  try {
    const qrcodes = await QRCode.find(filter);
    res.status(200).json({ success: true, data: qrcodes });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
