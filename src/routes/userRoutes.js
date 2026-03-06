import express from "express";
import {
  registerUser,
  loginUser,
  getUsers,
  activateUser,
  deactivateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", getUsers);
router.put("/activate/:id", activateUser);
router.put("/deactivate/:id", deactivateUser);

export default router;
