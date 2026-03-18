import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import User from "./models/User.js";
import progresoRoutes from "./routes/progresoRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import beneficioRoutes from "./routes/beneficio.routes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/progreso", progresoRoutes);
app.use("/api/streak", streakRoutes);
app.use(beneficioRoutes);
app.use("/api/reservations", reservationsRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

const crearAdminPorDefecto = async () => {
  try {
    const adminEmail = "admin@zonegym.com";
    const adminExists = await User.findOne({ email: adminEmail });

    if (!adminExists) {
      const hashedPassword = await bcrypt.hash("Admin123*", 10);

      await User.create({
        name: "Administrador ZoneGym",
        email: adminEmail,
        password: hashedPassword,
        role: "admin",
        isActive: true,
        membershipStatus: "active",
      });

      console.log("Admin por defecto creado");
    } else {
      console.log("Admin ya existe");
    }
  } catch (error) {
    console.error("Error creando admin:", error);
  }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
  await crearAdminPorDefecto();
});