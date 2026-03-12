const jwt = require("jsonwebtoken");
const JWT_SECRET = "clave_jwt_secreta";

const verificarJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).json({ mensaje: "Token requerido" });

    const token = authHeader.split(" ")[1];
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if(err) return res.status(401).json({ mensaje: "Token invalido" });
        req.user = decoded;
        next();
    });
};

module.exports = verificarJWT;