import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import progresoRoutes from "./routes/progresoRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import beneficioRoutes from "./routes/beneficio.routes.js";
import commentRoutes from "./routes/commentRoutes.js";

import User from "./models/User.js";

dotenv.config();

const app = express();

/* 🔐 Seguridad */
app.use(helmet());

/* 🌐 CORS */
const ORIGIN = process.env.ORIGIN || "http://localhost:5173";

app.use(cors({
  origin: ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

/* 🧠 Middleware */
app.use(express.json());

/* 🔥 RATE LIMIT SOLO COMMENTS */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Demasiadas peticiones, intenta más tarde"
});

app.use("/api/comments", limiter);

/* 📦 RUTAS */
app.use("/api/users", userRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/progreso", progresoRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/beneficios", beneficioRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/comments", commentRoutes);

/* 🟢 Ruta raíz */
app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

/* 👤 Crear admin automáticamente */
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

/* 🚀 INICIAR SERVIDOR CORRECTAMENTE */
const startServer = async () => {
  try {
    await connectDB(); // 🔥 esperar conexión a Mongo

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, async () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      await crearAdminPorDefecto();
    });

  } catch (error) {
    console.error("Error al iniciar servidor:", error);
  }
};

startServer();