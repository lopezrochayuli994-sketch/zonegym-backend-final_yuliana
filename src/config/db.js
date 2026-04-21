import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4
    });

    console.log("MongoDB conectado");

  } catch (error) {
    console.error("Error conectando MongoDB:", error);

    // ❌ NO hacer esto:
    // process.exit(1);

    // ✅ dejar que Railway siga vivo
  }
};

export default connectDB;