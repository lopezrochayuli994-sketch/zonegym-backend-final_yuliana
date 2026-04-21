import Comment from "../models/Comment.js";
import { validationResult } from "express-validator";

// Crear comentario
export const createComment = async (req, res) => {
  try {
    // 🔥 VALIDAR ERRORES DE express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
      });
    }

    const { text, user, rating } = req.body;

    // Validación extra (por seguridad)
    if (!text || text.trim() === "") {
      return res.status(400).json({
        message: "El comentario no puede estar vacío",
      });
    }

    const newComment = new Comment({
      text,
      user: user || "Anónimo",
      rating,
    });

    await newComment.save();

    res.status(201).json({
      message: "Comentario creado correctamente",
      comment: newComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al crear comentario",
    });
  }
};

// Obtener todos los comentarios
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort({ createdAt: -1 });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error al obtener comentarios",
    });
  }
};