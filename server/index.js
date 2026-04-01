import express from "express";
import cors from "cors";
import OpenAI from "openai";
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

// ✅ OPENAI CLIENT
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// ✅ MAIN API
app.post("/simplify-text", async (req, res) => {
  const { text } = req.body;
  console.log("Input text:", text);

  if (!text) return res.status(400).json({ error: "Text is required" });

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: `Simplify this legal text:\n${text}` }]
    });

    const simplifiedText = response.choices[0].message.content;
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