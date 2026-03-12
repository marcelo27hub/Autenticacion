const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const JWT_SECRET = "clave_jwt_secreta";

// Función simple para escapar HTML (XSS)
function escapar(input) {
    return input.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
}

const authController = {

    register: async (req, res) => {
        const email = escapar(req.body.email);
        const password = req.body.password;

        if(!email || !password) return res.status(400).json({ mensaje: "Faltan datos" });

        const hash = await bcrypt.hash(password, 10);
        try {
            const user = await User.create(email, hash);
            res.status(201).json({ mensaje: "usuario registrado correctamente", user });
        } catch(err) {
            res.status(400).json({ mensaje: "usuario ya registrado" });
        }
    },

    login: async (req, res) => {
        const email = escapar(req.body.email);
        const password = req.body.password;
        const authType = req.body.authType;
        if(!email || !password) return res.status(400).json({ mensaje: "Faltan datos" });

        try {
            const user = await User.findByEmail(email);
            if(!user) return res.status(401).json({ mensaje: "usuario o contrasenha incorrecta" });

            const coincide = await bcrypt.compare(password, user.password);
            if(!coincide) return res.status(401).json({ mensaje: "usuario o contrasenha incorrecta" });

            // Cookie session
            if(authType === "cookie"){
                req.session.userId = user.id;
                req.session.role = user.rol;
                return res.json({ mensaje: "login con cookie exitoso" });
            }

            // JWT
            if(authType === "jwt"){
                const token = jwt.sign({ id: user.id, role: user.rol }, JWT_SECRET, { expiresIn: "1h" });
                return res.json({ mensaje: "login con jwt exitoso", token });
            }

            res.status(400).json({ mensaje: "Tipo de autenticacion invalida" });

        } catch(err) {
            res.status(500).json({ mensaje: "error interno" });
        }
    },

    perfilCookie: (req, res) => {
        if(!req.session.userId) return res.status(401).json({ mensaje: "No autenticado" });
        res.json({ mensaje: "Perfil con cookie", userId: req.session.userId, role: req.session.role });
    },

    logout: (req,res) => {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.json({ mensaje: "sesion cerrada" });
        });
    },

    perfilJWT: (req,res) => {
        res.json({ mensaje: "Perfil con jwt", user: req.user });
    },

        adminDashboard: (req,res) => {
        res.json({ mensaje: "Bienvenido al panel de administrador" });
    }

};

module.exports = authController;