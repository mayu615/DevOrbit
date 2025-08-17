import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    lastMessage: { type: String, default: "" },
    lastMessageAt: { type: Date, default: null },
  },
  { timestamps: true }
);

// index for faster lookup (not unique — but we filter by $size in queries)
conversationSchema.index({ participants: 1, updatedAt: -1 });

export default mongoose.model("Conversation", conversationSchema);
