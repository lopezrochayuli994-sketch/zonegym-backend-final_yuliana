import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    user: {
      type: String, // puedes cambiarlo luego a ObjectId
      default: "Anónimo",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Comment", commentSchema);
