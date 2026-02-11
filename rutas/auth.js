//arrays para guardarlos temporalmente
const usuarios =[];

app.post("/register", (req, res) =>{
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

    usuarios.push({email, password});

    res.status(200).json({mensaje: "usuario registrado correctamente"});
});
