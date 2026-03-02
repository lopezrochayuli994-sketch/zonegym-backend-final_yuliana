import express from "express";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

const router = express.Router();

// REGISTRO
router.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const userExists = await User.findOne({email});
        if (userExists) {
            return res.status(400).json({message: "El usuario ya existe"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        await user.save();

        res.status(201).json({message: "Usuario registrado correctamente"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

// LOGIN
router.post("/login", async (req, res) => {
    try {
        const {name, password} = req.body;

        const user = await User.findOne({name});
        if (!user) {
            return res.status(400).json({message: "Usuario no encontrado"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Contraseña incorrecta"});
        }

        res.json({message: "Login exitoso"});
    } catch (error) {
        res.status(500).json({error: error.message});
    }
});

export default router;
