import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    // Core
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
    company: { type: String, required: true },

    // Normalized
    jobType: {
      type: String,
      enum: ["Full-time", "Part-time", "Internship", "Contract", "Other"],
      default: "Full-time",
    },
    salaryText: { type: String },            // e.g. "USD $80k–$100k"
    remote: { type: Boolean, default: true }, // Remotive mostly remote

    // Source metadata (for real APIs)
    source: { type: String, enum: ["remotive"], default: "remotive" },
    externalId: { type: String },             // Remotive: job.id
    jobUrl: { type: String },                 // Remotive: job.url
    logoUrl: { type: String },                // Remotive: job.company_logo_url
    category: { type: String },               // Remotive: job.category
    tags: [{ type: String }],
    publishedAt: { type: Date },

    // App metadata
    postedBy: {                               // user-created jobs -> set by auth
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,                        // << was true (blocked imports)
      default: null,
    },
  },
  { timestamps: true }
);

// Avoid duplicates if same job comes again
jobSchema.index({ externalId: 1, source: 1 }, { unique: true, sparse: true });

export default mongoose.model("Job", jobSchema);
