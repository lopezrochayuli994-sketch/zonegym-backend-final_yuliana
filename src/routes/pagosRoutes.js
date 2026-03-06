import express from "express";
import { renovarMembresia } from "../controllers/pagosController.js";

const router = express.Router();

router.post("/renovar", renovarMembresia);

export default router;
