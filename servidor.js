//servidor
const express = require("express");
const cors = require("cors");

const authrutas = require("./rutas/auth")

const app = express();
const PORT = 5000;

//middleware
app.use(cors()); //permite request desde otro puerto 
app.use(express.json()); //para recibir json en post

//rutas
app.use("/auth", authrutas)


//ruta de prueba 
app.get("/", (req, res) =>{
    res.send("servidor corriendo");
});


//iniciar servidor
app.listen(PORT, () =>{
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});