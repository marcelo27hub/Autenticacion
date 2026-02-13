const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

//arrays para guardarlos temporalmente
const usuarios =[];

//ruta de registro
router.post("/register", async (req, res) =>{
    const {email, password} = req.body;

    //verificar que los datos existen 
    if (!email || !password) {
        return res.status(400).json({mensaje: "Faltan datos"})
    }

    //verificar si ya existe el usuario
    const existeusuario = usuarios.find(u => u.email === email)
    if (existeusuario){
        return res.status(400).json({mensaje: "usuario ya registrado"});
    }
    const hash = await bcrypt.hash(password, 10); //para hashear la contrassenha
    usuarios.push({email, password: hash});

    res.status(201).json({mensaje: "usuario registrado correctamente"});
});

//ruta de login 
router.post("/login", async (req,res) =>{
    const {email, password} = req.body;

        //verificar que los datos existen 
    if (!email || !password) {
        return res.status(400).json({mensaje: "Faltan datos"})
    }

    //buscamos el usuario
    const usuario = usuarios.find(u => u.email === email);

    if (!usuario){
        return res.status(401).json({mensaje: "usuario o contrasenha incorrecta"});
    }

    const coincide= await bcrypt.compare(password, usuario.password);

    if (!coincide){
        return res.status(401).json({mersaje: "usuario o contrasenha incorrecta"});
    }
    res.status(200).json({mensaje: "login exitoso"});
});

module.exports = router;