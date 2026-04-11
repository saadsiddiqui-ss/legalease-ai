import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Document from "./models/Document.js";

dotenv.config();

connectDB();

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
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

// ✅ MAIN API
app.post("/simplify-text", async (req, res) => {
  const { text } = req.body;
  console.log("Input text:", text);

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const prompt = `Simplify this legal text in easy language:\n${text}`;
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const simplifiedText = response.text();

    console.log("Simplified text:", simplifiedText);

    // ✅ Save to MongoDB
    const savedDocument = await Document.create({
      originalText: text,
      simplifiedText: simplifiedText,
    });

    res.json({
      message: "Text simplified and saved successfully",
      result: simplifiedText,
      savedDocument,
    });
  } catch (err) {
    console.error("AI / DB ERROR:", err);
    res.status(500).json({
      error: "AI or database error",
      details: err.message || err,
    });
  }
});

// ✅ FETCH ALL SAVED DOCUMENTS
app.get("/documents", async (req, res) => {
  try {
    const documents = await Document.find().sort({ createdAt: -1 });
    res.json(documents);
  } catch (err) {
    console.error("FETCH ERROR:", err);
    res.status(500).json({
      error: "Failed to fetch documents",
      details: err.message || err,
    });
  }
});

app.delete("/documents/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const deletedDoc = await Document.findByIdAndDelete(id);

    if (!deletedDoc) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ message: "Document deleted successfully" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({
      error: "Failed to delete document",
      details: err.message || err,
    });
  }
});

// ✅ SERVER START
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT} 🚀`));