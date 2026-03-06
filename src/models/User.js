import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    membershipStatus: {
      type: String,
      enum: ["pending", "active", "inactive"],
      default: "pending",
    },
    packageName: {
      type: String,
      default: "",
    },
    paymentReference: {
      type: String,
      default: "",
    },
    paymentProof: {
      type: String,
      default: "",
    },
    messageForAdmin: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
