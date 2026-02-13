const sqlite3 = require("sqlite3").verbose();

//creamos la base de datos
const db = new sqlite3.Database("./database.db", (error) => {
    if (error){
        console.log("Error al conectar con la base de datos", error.message);
    } else {
        console.log("Conectado a sqlite3");
    }
});

//crear la tabla de usuarios si no existe
db.run(`CREATE TABLE IF NOT EXISTS usuarios(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    rol TEXT DEFAULT "usaurio")`
    );

module.export = db;
