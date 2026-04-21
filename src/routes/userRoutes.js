import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  activateUser,
  deactivateUser,
} from "../controllers/userController.js";

import { verifyToken, isAdmin } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//  PERFIL (cualquier usuario con token)
router.get("/perfil", verifyToken, (req, res) => {
  res.json({
    message: "Acceso permitido",
    user: req.user,
  });
});

// SOLO ADMIN
router.get("/", verifyToken, isAdmin, getUsers);

router.put("/activate/:id", verifyToken, isAdmin, activateUser);

router.put("/deactivate/:id", verifyToken, isAdmin, deactivateUser);

export default router;