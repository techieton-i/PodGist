import mongoose from "mongoose";

const SummarySchema = new mongoose.Schema(
  {
    episodeId: { type: String, unique: true },
    summary: String,
  },
  { timestamps: true }
);

const Summary =
  mongoose.models.Summary || mongoose.model("Summary", SummarySchema);

export default Summary;
