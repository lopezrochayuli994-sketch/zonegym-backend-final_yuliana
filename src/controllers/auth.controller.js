import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Buscar usuario
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Usuario no existe" });
    }

    // 2. Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // 3. Crear token
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    );

    // 4. Respuesta
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Error en login" });
  }
};