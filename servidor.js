const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

//middleware
app.use(cors()); //permite request desde otro puerto 
app.use(express.json()); //para recibir json en post

//ruta de prueba 
app.get("/", (req, res) =>{
    res.send("servidor corriendo");
});

//iniciar servidor
app.listen(PORT, () =>{
    console.log(`servidor corriendo en http://localhost:${PORT}`);
});