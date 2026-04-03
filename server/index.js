import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai"; // 👈 Update: Google AI Library
import dotenv from "dotenv";

dotenv.config();

const app = express();

// ✅ MIDDLEWARE
app.use(cors());
app.use(express.json());

// ✅ LOG ALL REQUESTS
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.url} called`);
  next();
});

// ✅ TEST ROUTE
app.get("/test", (req, res) => {
  console.log("[GET] /test called");
  res.send("Working ✅");
});

// ✅ GOOGLE AI CLIENT (GEMINI)
// Make sure your .env has GOOGLE_API_KEY
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }); // 👈 Aap gemini-1.5-pro bhi use kar sakte hain

// ✅ MAIN API
app.post("/simplify-text", async (req, res) => {
  const { text } = req.body;
  console.log("Input text:", text);

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    // 👈 Update: Gemini Syntax
    const prompt = `Simplify this legal text:\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const simplifiedText = response.text();

    console.log("Simplified text:", simplifiedText);

    res.json({ result: simplifiedText });

  } catch (err) {
    console.error("AI ERROR:", err);
    res.status(500).json({
      error: "AI error",
      details: err.message || err
    });
  }
});

// ✅ SERVER START
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));