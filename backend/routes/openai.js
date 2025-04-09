// routes/openai.js
import axios from "axios";
import express from "express";
import OpenAI from "openai";
import GeneratedImage from "../models/GeneratedImage.js";
import * as dotenv from "dotenv";
dotenv.config();
const router = express.Router();

// Instantiate the OpenAI client using your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Route to generate an image based on a prompt
router.post("/generate-image", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // Call the OpenAI API to generate an image
    const response = await openai.images.generate({
      prompt: prompt,
      n: 1,
      size: "256x256", // Specify the desired image size
    });

    // Extract the image URL from the response
    // (the structure should be similar to the previous versions)
    console.log("OpenAI response:", response);

    const imageUrl = response.data[0].url;

    // Optionally, save the generated image info to the database
    const generatedImage = await GeneratedImage.create({ prompt, imageUrl });

    res.status(200).json({ success: true, data: { imageUrl: generatedImage.imageUrl } });
  } catch (error) {
    console.error("Error generating image:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get("/download-image", async (req, res) => {
  const { imageUrl, prompt } = req.query;

  if (!imageUrl || !prompt) {
    return res.status(400).send("Missing imageUrl or prompt.");
  }

  try {
    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer", // important to preserve binary data
    });

    const filename = `${prompt.replace(/\s+/g, "_").toLowerCase()}.png`;

    res.set({
      "Content-Type": "image/png",
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    res.send(response.data);
  } catch (error) {
    console.error("Download error:", error.message);
    res.status(500).send("Failed to download image.");
  }
});

export default router;
