import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import pagosRoutes from "./routes/pagosRoutes.js";
import reservationsRoutes from "./routes/reservations.routes.js";
import progresoRoutes from "./routes/progresoRoutes.js";
import streakRoutes from "./routes/streakRoutes.js";
import beneficioRoutes from "./routes/beneficio.routes.js";
import commentRoutes from "./routes/commentRoutes.js";
import helmet from "helmet";
import User from "./models/User.js";
import rateLimit from "express-rate-limit";

dotenv.config();
connectDB();

const app = express();

app.use(helmet());

// 🔥 CORS USANDO .env + PREFLIGHT (ESTO ARREGLA TU ERROR)
const ORIGIN = process.env.ORIGIN || "http://localhost:5173";

// 1) Responder SIEMPRE al preflight (OPTIONS)
app.options("*", (req, res) => {
  res.header("Access-Control-Allow-Origin", ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.sendStatus(204);
});

// 2) Forzar headers en TODAS las respuestas
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", ORIGIN);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// 3) cors() (opcional pero útil)
app.use(cors({
  origin: ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.use(express.json());

/* 🔥 RATE LIMIT */
const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Demasiadas peticiones, intenta más tarde"
});

/* ✅ SOLO COMMENTS */
app.use("/api/comments", limiter);

/* ✅ RUTAS */
app.use("/api/users", userRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/progreso", progresoRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/beneficios", beneficioRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/comments", commentRoutes);

// (puedes quitar esto si quieres evitar duplicados)
app.use("/api", userRoutes);

app.get("/", (req, res) => {
  res.send("Servidor funcionando");
});

/* 👤 CREAR ADMIN */
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