const jwt = require("jsonwebtoken");
const { descifrar } = require("../utils/crypto");
const JWT_SECRET = "clave_jwt_secreta";

const verificarJWT = (req, res, next) => {
        let token = null;

    // Primero buscamos token en header Authorization
    if(req.headers.authorization){
        token = req.headers.authorization.split(" ")[1];
    }

    // Si no está en header, buscamos en cookie
    if(!token && req.cookies.jwt){
        token = req.cookies.jwt;
    }

    if(!token) {
        return res.status(401).render("login", {
            csrfToken: req.csrfToken(),
            mensaje: "Token requerido",
            tipo: "error"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err){
            return res.status(401).render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "Token inválido",
                tipo: "error"
            });
        }

        try {
            const datos = JSON.parse(descifrar(decoded.data));
            req.user = datos;
            next();
        } catch (e) {
            return res.status(500).render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "Error al descifrar token",
                tipo: "error"
            });
        }
    });
};

module.exports = verificarJWT;