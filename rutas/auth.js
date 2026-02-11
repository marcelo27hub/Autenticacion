//arrays para guardarlos temporalmente
const usuarios =[];

//ruta de registro
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

    res.status(201).json({mensaje: "usuario registrado correctamente"});
});

//ruta de login 
app.post("/login", (req,res) =>{
    const {email, password} = req.body;

        //verificar que los datos existen 
    if (!email || !password) {
        return res.status(400).json({mensaje: "Faltan datos"})
    }

    //buscamos el usuario
    const usuario = usuarios.find(u => u.email === email && u.password === password);

    if (!usuario){
        return res.status(401).json({mensaje: "usuario om contrasenha incorrecta"});
    }

    res.status(200).json({mensaje: "login exitoso"});
});