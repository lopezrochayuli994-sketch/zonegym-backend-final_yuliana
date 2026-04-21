import express from "express";
import {
  createComment,
  getComments,
} from "../controllers/commentController.js";

// ✅ VALIDADORES
import { body } from "express-validator";

// ✅ SANITIZADOR


const router = express.Router();

/* 🔐 Sanitizar todo lo que entre */


/* ✅ Crear comentario con validación */
router.post(
  "/",
  [
    body("text")
      .isLength({ max: 200 })
      .withMessage("El comentario no debe superar 200 caracteres")
      .trim()
      .escape(),

    body("rating")
      .isInt({ min: 1, max: 5 })
      .withMessage("La puntuación debe ser un número entre 1 y 5"),
  ],
  createComment
);

/* 📥 Obtener comentarios */
router.get("/", getComments);

export default router;