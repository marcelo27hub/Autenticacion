//verificar rol
const verificarRol = (rolrequerido) => {
    return (req, res, next) => {
        const userRole = req.user ? req.user.role : req.session?.role;
        if (!userRole) return res.status(401).json({mensaje: "No autenticado"});

        if (userRole !== rolrequerido) {
            return res.status(403).json({mensaje : "Acceso denegado: rol imsuficiente"});
        }
        next();
    };
};

module.exports = verificarRol;