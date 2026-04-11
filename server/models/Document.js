import mongoose from "mongoose";

const documentSchema = new mongoose.Schema(
  {
    originalText: {
      type: String,
      required: true,
    },
    simplifiedText: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Document = mongoose.model("Document", documentSchema);

export default Document;