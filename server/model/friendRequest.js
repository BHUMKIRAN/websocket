import mongoose, { Schema, Document, Types } from "mongoose";

const FriendRequestSchema = new Schema(
  {
    from: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    to: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

FriendRequestSchema.index({ from: 1, to: 1 }, { unique: true });

export default mongoose.model("FriendRequest", FriendRequestSchema);
