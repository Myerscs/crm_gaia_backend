export const verifyRole = (rolesPermitidos) => {
  return (req, res, next) => {
    const user = req.user; 
    if (!user) {
      return res.status(401).json({ message: "No autenticado" });
    }
    if (!rolesPermitidos.includes(user.rol)) {
      return res.status(403).json({ message: "No tienes permisos para realizar esta acción" });
    }
    next();
  };
};

export default verifyRole;