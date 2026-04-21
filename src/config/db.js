import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("MONGO_URI:", process.env.MONGO_URI);

    await mongoose.connect(process.env.MONGO_URI, {
      family: 4 // 🔥 ESTA LÍNEA ARREGLA TU ERROR
    });

    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error conectando MongoDB:", error);
    process.exit(1);
  }
};

export default connectDB;
