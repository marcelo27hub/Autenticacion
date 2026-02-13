const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const db = require("../config/database");

//ruta de registro
router.post("/register", async (req, res) =>{
    const {email, password} = req.body;

    //verificar que los datos existen 
    if (!email || !password) return res.status(400).json({mensaje: "Faltan datos"})

    const hash = await bcrypt.hash(password, 10); //para hashear la contrassenha

    db.run("INSERT INTO usuarios (email, password) VALUES(?, ?)",
        [email,hash],
        function (error){
            if (error){
                return res.status(400).json({mensaje: "Usuario ya registrado"});
            } 
            return res.status(201).json({mensaje: "usuario registrado correctamente"});
        }
    );    
});

//ruta de login 
router.post("/login", async (req,res) =>{
    const {email, password} = req.body;

    //verificar que los datos existen 
    if (!email || !password)  return res.status(400).json({mensaje: "Faltan datos"})
    
    db.get("SELECT * FROM usuarios WHERE email = ?", [email], async (error, usuario) =>{
        if (error) return res.status(500).json({mensaje: "error interno"});
        if (!usuario) return res.status(401).json({mensaje: "usuario o contrasenha incorrecta"});
        
        //comparamos los hashes\
        const coincide = await bcrypt.compare(password, usuario.password);
        if (!coincide) return res.status(401).json({mensaje: "usuario o contrasenha incorrecta"});

        res.status(200).json({mensaje: "Login exitoso"});
    });
});


module.exports = router;