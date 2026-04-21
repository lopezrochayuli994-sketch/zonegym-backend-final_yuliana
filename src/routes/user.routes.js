import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// ✅ RUTA PERFIL
router.get("/perfil", verifyToken, (req, res) => {
  res.json({
    message: "Acceso permitido",
    user: req.user
  });
});

export default router;