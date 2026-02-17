const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../config/database");


const JWT_SECRET = "clave_jwt_secreta";


//ruta de registro
router.post("/register", async (req, res) =>{
    const {email, password} = req.body;

    //verificar que los datos existen 
    if (!email || !password) return res.status(400).json({mensaje: "Faltan datos"})

    const hash = await bcrypt.hash(password, 10); //para hashear la contrassenha

    db.run("INSERT INTO users (email, password) VALUES(?, ?)",
        [email,hash],
        function (error){
            if (error){
                return res.status(400).json({mensaje: "usuario ya registrado"});
            } 
            return res.status(201).json({mensaje: "usuario registrado correctamente"});
        }
    );    
});

//login con (cookie o jwt)
router.post("/login", async (req,res) =>{
    const {email, password} = req.body;

    //verificar que los datos existen 
    if (!email || !password)  return res.status(400).json({mensaje: "Faltan datos"})
    
    db.get("SELECT * FROM users WHERE email = ?", [email], async (error, user) =>{
        if (error) return res.status(500).json({mensaje: "error interno"});
        if (!user) return res.status(401).json({mensaje: "usuario o contrasenha incorrecta"});
        
        //comparamos los hashes\
        const coincide = await bcrypt.compare(password, user.password);
        if (!coincide) return res.status(401).json({mensaje: "usuario o contrasenha incorrecta"});


        //opcion cookie 
        if (authtype  === "cookie"){
            req.session.userId = user.id;
            req.session.role = user.rol;

            return res.json({mensaje: "login con cookie exitoso"});
        }

        //opcion jwt
        if (authtype === "jwt"){
            const token = jwt.sign({
                id: user.id, role: user.rol},
                JWT_SECRET,
                {expiresIn: "1h"}

            );
            return res.json({
                mensaje: "login con jwt extiso", token
            });
        }
        res.status(400).json({mensaje: "Tipo de autenticacion invalida"});

    });
});


//perfil con cookie
router.get("/perfil", (req,res) =>{
    if (!req.usuario.userId){
        return res.status(401).json({mensaje: "No autenticado"});
    }

    res.json({
        mensaje: "Perfil con cookie",
        userId: req.session.userId,
        role: req.session.role
    });
});


//logout cookie
router.post("/logout", (req, res) =>{
    req.session.destroy(() => {
        res.clearCookie("connect.sid")
        res.json({mensaje: "sesion cerrada"});
    });
});


//middleware jwt
function verificarjwt(req,res,next) {
    const authHeader = req.headers.auhorization;
    if(!authheader){
        return res.status(401).json({mensaje: "Token requerido"});
    }
    
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (error, decoded) => {
        if (error) {
            return res.status(401).json({mensaje: "Token invalido"});
        }

        req.user = decoded;
        next();
    });
    
}


//pperfil con jwt 
router.get("perfil-jwt", verificarjwt, (req, res) =>{
    res.json({
        mensaje: " perfil con jwt",
        user: req.user
    });
});

module.exports = router;