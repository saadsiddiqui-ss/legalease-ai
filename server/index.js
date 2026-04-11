import multer from "multer";
import fs from "fs";
import "pdf-parse/worker";
import { PDFParse } from "pdf-parse";

import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Document from "./models/Document.js";

dotenv.config();
connectDB();

const app = express();
const upload = multer({ dest: "uploads/" });

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

// ✅ COMMON PROMPT BUILDER
const buildPrompt = (legalText) => `
You are a legal assistant AI.

Analyze the following legal text and give the response in this exact format:

SUMMARY:
Write a short plain-English summary.

KEY POINTS:
- Mention the most important clauses in simple language
- Mention deadlines, payment terms, obligations, restrictions if present

RISKS:
- Mention any risky, unfair, harmful, confusing, or dangerous clauses
- If there are no major risks, say "No major risks found"

SUGGESTIONS:
- Suggest safer improvements or things the user should review before signing
- If everything looks fine, say "No major suggestions"

PLAIN ENGLISH:
Rewrite the full legal text in very simple and easy language.

Legal text:
${legalText}
`;

// ✅ PDF UPLOAD API
app.post("/upload-pdf", upload.single("pdf"), async (req, res) => {
  let parser = null;

  try {
    if (!req.file) {
      return res.status(400).json({ error: "PDF file is required" });
    }

    const dataBuffer = fs.readFileSync(req.file.path);

    parser = new PDFParse({ data: dataBuffer });
    const pdfData = await parser.getText();
    const extractedText = pdfData.text;
    console.log("EXTRACTED PDF TEXT:", extractedText);

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: "Could not extract text from PDF" });
    }

    const prompt = buildPrompt(extractedText);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const simplifiedText = response.text();

    const savedDocument = await Document.create({
      originalText: extractedText,
      simplifiedText: simplifiedText,
    });

    res.json({
      message: "PDF analyzed and saved successfully",
      result: simplifiedText,
      savedDocument,
    });
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({
      error: "PDF processing failed",
      details: err.message || err,
    });
  } finally {
    try {
      if (parser) {
        await parser.destroy();
      }
    } catch (e) {
      console.error("Parser destroy error:", e.message);
    }

    try {
      if (req.file?.path && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
    } catch (e) {
      console.error("File cleanup error:", e.message);
    }
  }
});

// ✅ MAIN TEXT API
app.post("/simplify-text", async (req, res) => {
  const { text } = req.body;
  console.log("Input text:", text);

  if (!text) {
    return res.status(400).json({ error: "Text is required" });
  }

  try {
    const prompt = buildPrompt(text);
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const simplifiedText = response.text();

    console.log("Simplified text:", simplifiedText);

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

// ✅ DELETE DOCUMENT
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