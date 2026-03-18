const jwt = require("jsonwebtoken");
const { descifrar } = require("../utils/crypto");
const JWT_SECRET = "clave_jwt_secreta";

const verificarSesionOCookie = (req, res, next) => {
    // Si hay sesión de cookie
    if(req.session?.userId){
        req.user = {id: req.session.userId, role: req.session.role };
        return next();
    }

    // Si hay JWT en cookie
    const token = req.cookies.jwt;
    if(token){
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            // descifrar el payload
            const datos = JSON.parse(descifrar(decoded.data));
            req.user = datos;
            return next();
        } catch(err) {
            return res.status(401).render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "Token JWT inválido",
                tipo: "error"
            });
        }
    }

    // Ninguna sesión válida
    return res.status(401).render("login", {
        csrfToken: req.csrfToken(),
        mensaje: "No autenticado",
        tipo: "error"
    });
};

module.exports = verificarSesionOCookie;