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

app.use(cors({
  origin: ["http://localhost:5173",
  "https://zonegym-frontend-finalyuliana.vercel.app"],
  credentials: true
}));

app.use(express.json());

/* 🔥 RATE LIMIT (AQUÍ VA BIEN) */
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // máximo 10 peticiones
  message: "Demasiadas peticiones, intenta más tarde"
});

/* ✅ APLICAR SOLO A COMMENTS */
app.use("/api/comments", limiter);

/* ✅ RUTAS */
app.use("/api/users", userRoutes);
app.use("/api/pagos", pagosRoutes);
app.use("/api/progreso", progresoRoutes);
app.use("/api/streak", streakRoutes);
app.use("/api/beneficios", beneficioRoutes);
app.use("/api/reservations", reservationsRoutes);
app.use("/api/comments", commentRoutes);


/* 👇 IMPORTANTE */
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