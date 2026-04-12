import mongoose from "mongoose";

const { Schema } = mongoose;

const ChatSchema = new Schema(
  {
    isGroup: {
      type: Boolean,
      default: false,
    },

    name: {
      type: String,
      trim: true,
    },

    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },

    lastMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  { timestamps: true },
);

ChatSchema.index({ participants: 1 });

export default mongoose.model("Chat", ChatSchema);
