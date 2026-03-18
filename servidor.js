//servidor
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieparser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const csurf = require("csurf");


const authrutas = require("./routes/auth")

const app = express();
const PORT = 5000;

// Limitar intentos de login (fuerza bruta)
const loginLimiter = rateLimit({
    windowMs: 60 * 1000, // 30 seg
    max: 5,
    handler: (req, res) => {
        res.status(429).render("login", {
            csrfToken: req.csrfToken(),
            mensaje: "Demasiados intentos de login. Intenta más tarde.",
            tipo: "error"
        });
    }
});

// motor de plantillas
app.set("view engine", "ejs");
app.set("views", "./views");

//middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
})); // para que mi backend solo pueda leeer solo este puerto y no de otros computadoras

app.use(express.json()); // para que que express pueda leer lo que venga del body en json
app.use(express.urlencoded({ extended: true }));

//cookies y sesiones
app.use(cookieparser());
app.use(session({
    secret: "clave_super_secreta",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));

// crsf
app.use(csurf({cookie: true}));

//rutas
app.use("/auth", authrutas(loginLimiter));


//ruta de prueba 
app.get("/", (req, res) =>{
    res.send("servidor corriendo");
});

app.use((err, req, res, next) => {
    if(err.code === "EBADCSRFTOKEN") {
    return res.status(403).json({ mensaje: "Token CSRF inválido" });
    }
    if(err.name === "UnauthorizedError") {
    return res.status(401).json({ mensaje: "JWT inválido" });
    }
    console.error(err);
    res.status(500).json({ mensaje: "Error interno del servidor" });
});

//iniciar servidor
app.listen(PORT, () =>{
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});