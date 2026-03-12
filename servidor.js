//servidor
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const cookieparser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const csurf = require("csurf");


const authrutas = require("./rutas/auth")

const app = express();
const PORT = 5000;

// Limitar intentos de login (fuerza bruta)
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 min
    max: 5,
    message: { mensaje: "Demasiados intentos de login. Intenta más tarde." },
    standardHeaders: true,
    legacyHeaders: false
});

//middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
})); // para que mi backend solo pueda leeer solo este puerto y no de otros computadoras

app.use(express.json()); // para que que express pueda leer lo que venga del body en json

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
        maxAge: 1000 * 60 * 60 //1 hora
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


//iniciar servidor
app.listen(PORT, () =>{
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});