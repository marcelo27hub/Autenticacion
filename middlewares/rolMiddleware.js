// verificar rol
const verificarRol = (rolrequerido) => {
    return (req, res, next) => {

        const userRole = req.user ? req.user.role : req.session?.role;
        const userId = req.user ? req.user.id : req.session?.userId;

        if (!userRole) {
            return res.status(401).render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "No autenticado",
                tipo: "error"
            });
        }

        if (userRole !== rolrequerido) {
            return res.status(403).render("perfil", {
                userId: userId,
                role: userRole,
                csrfToken: req.csrfToken(),
                mensaje: "Acceso denegado: rol insuficiente",
                tipo: "error"
            });
        }

        next();
    };
};

module.exports = verificarRol;