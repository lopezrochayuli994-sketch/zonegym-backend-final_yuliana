import User from "../models/User.js";
import bcrypt from "bcryptjs";

// REGISTRO
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      packageName,
      paymentReference,
      paymentProof,
      messageForAdmin,
    } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      packageName,
      paymentReference,
      paymentProof,
      messageForAdmin,
      role: "user",
      isActive: false,
      membershipStatus: "pending",
    });

    res.status(201).json({
      message:
        "Usuario registrado. Queda pendiente de activación por el administrador.",
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      membershipStatus: user.membershipStatus,
    });
  } catch (error) {
    console.error("Error registerUser:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ message: "Correo o contraseña incorrectos" });
    }

    if (user.role !== "admin" && !user.isActive) {
      return res.status(403).json({
        message: "Tu cuenta está pendiente de aprobación por el administrador.",
      });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      membershipStatus: user.membershipStatus,
      message: `Bienvenido, ${user.name}`,
    });
  } catch (error) {
    console.error("Error loginUser:", error);
    res.status(500).json({ message: "Error al intentar iniciar sesión" });
  }
};

// OBTENER TODOS LOS USUARIOS
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    console.error("Error getUsers:", error);
    res.status(500).json({ message: "Error al obtener usuarios" });
  }
};

// ACTIVAR USUARIO
export const activateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isActive = true;
    user.membershipStatus = "active";

    await user.save();

    res.json({ message: "Usuario activado correctamente" });
  } catch (error) {
    console.error("Error activateUser:", error);
    res.status(500).json({ message: "Error al activar usuario" });
  }
};

// DESACTIVAR USUARIO
export const deactivateUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    user.isActive = false;
    user.membershipStatus = "inactive";

    await user.save();

    res.json({ message: "Usuario desactivado correctamente" });
  } catch (error) {
    console.error("Error deactivateUser:", error);
    res.status(500).json({ message: "Error al desactivar usuario" });
  }
};
