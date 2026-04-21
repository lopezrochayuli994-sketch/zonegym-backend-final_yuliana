import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log("HEADER:", authHeader);

  const token = authHeader?.split(" ")[1];

  console.log("TOKEN:", token);

  if (!token) {
    return res.status(401).json({ message: "No autorizado" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("DECODED:", decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("ERROR JWT:", error.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Solo admin" });
  }
  next();
};