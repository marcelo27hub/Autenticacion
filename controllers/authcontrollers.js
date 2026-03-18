const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { cifrar, descifrar } = require("../utils/crypto");

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

        if(!email || !password) {
            return res.render("register", {
                csrfToken: req.csrfToken(),
                mensaje: "Faltan datos",
                tipo: "error"
            });
        }

        const hash = await bcrypt.hash(password, 10);
        try {
            const user = await User.create(email, hash);
            return res.render("register", {
                csrfToken: req.csrfToken(),
                mensaje: "Usuario registrado correctamente",
                tipo: "exito"
            });
        } catch(err) {
            return res.render("register", {
                csrfToken: req.csrfToken(),
                mensaje: "Usuario ya registrado",
                tipo: "error"
            });
        }
    },

    login: async (req, res) => {
        const email = escapar(req.body.email);
        const password = req.body.password;
        const authType = req.body.authType;

        if(!email || !password) {
            return res.render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "Faltan datos",
                tipo: "error"
            });
        }

        try {
            const user = await User.findByEmail(email);
            if(!user) {
                return res.render("login", {
                    csrfToken: req.csrfToken(),
                    mensaje: "Usuario o contraseña incorrecta",
                    tipo: "error"
                });
            }

            const coincide = await bcrypt.compare(password, user.password);
            if(!coincide) {
                return res.render("login", {
                    csrfToken: req.csrfToken(),
                    mensaje: "Usuario o contraseña incorrecta",
                    tipo: "error"
                });
            }

            // Cookie session
            if(authType === "cookie"){
                req.session.userId = user.id;
                req.session.role = user.rol;
                return res.render("perfil", {
                    userId: user.id,
                    role: user.rol,
                    csrfToken: req.csrfToken(),
                    mensaje: "Login exitoso con cookie",
                    tipo: "exito"
                });
            }

            // JWT
            if(authType === "jwt"){
                const payload = { id: user.id, role: user.rol };

                const encrypted = cifrar(JSON.stringify(payload));

                const token = jwt.sign(
                    { data: encrypted },
                    JWT_SECRET,
                    { expiresIn: "1h" }
                );

                res.cookie("jwt", token, {
                    httpOnly: true,
                    secure: false, // para localhost, en prod poner true
                    sameSite: "strict",
                    maxAge: 1000 * 60 * 60
    });
                return res.render("perfil", {
                    userId: user.id,
                    role: user.rol,
                    csrfToken: req.csrfToken(),
                    mensaje: "Login exitoso con JWT",
                    tipo: "exito"
                });
            
            }

            return res.render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "Tipo de autenticación inválida",
                tipo: "error"
            });

        } catch(err) {
            // Captura de rate limit u otros errores
            const msg = err.message.includes("rate limit") ? 
                "Demasiados intentos de login. Intenta más tarde." : "Error interno del servidor";
            return res.render("login", {
                csrfToken: req.csrfToken(),
                mensaje: msg,
                tipo: "error"
            });
        }
    },

    perfilCookie: (req, res) => {
        if(!req.session.userId){
            return res.render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "No autenticado",
                tipo: "error"
            });
        }

        res.render("perfil", {
            userId: req.session.userId,
            role: req.session.role,
            csrfToken: req.csrfToken()
        });
    },


    logout: (req,res) => {
        req.session.destroy(() => {
            res.clearCookie("connect.sid");
            res.clearCookie("jwt");

            res.render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "Sesión cerrada",
                tipo: "exito"
            });
        });
    },

    perfilJWT: (req,res) => {
        res.render("perfil", {
            userId: req.user.id,
            role: req.user.role,
            token: req.cookies.jwt, // opcional, mostrar JWT
            csrfToken: req.csrfToken(),
            mensaje: "Perfil con JWT",
            tipo: "exito"
    });
    },

    adminDashboard: (req,res) => {
        res.render("perfil", {
            userId: req.user?.id || req.session?.userId,
            role: req.user?.role || req.session?.role,
            csrfToken: req.csrfToken(),
            mensaje: "Bienvenido al panel de administrador",
            tipo: "exito"
        });
    },

    mostrarLogin: (req, res) => {
        res.render("login", { csrfToken: req.csrfToken() });
    },

    mostrarRegister: (req, res) => {
        res.render("register", { csrfToken: req.csrfToken() });
    },

    mostrarPerfil: (req, res) => {
        if (!req.session.userId) {
            return res.status(401).render("login", {
                csrfToken: req.csrfToken(),
                mensaje: "No autenticado",
                tipo: "error"
            });
        }

        res.render("perfil", {
            userId: req.session.userId,
            role: req.session.role,
            csrfToken: req.csrfToken()
        });
    }


};

module.exports = authController;