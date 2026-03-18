const bcrypt = require("bcrypt");
const User = require("./models/user");

async function crearAdmin() {
    const email = "admin@challenge.com";
    const password = "admin123"; // puedo cambiarlo
    const rol = "administrador";

    const hash = await bcrypt.hash(password, 10);

    try {
        const user = await User.create(email, hash, rol);
        console.log("Admin creado:", user);
    } catch (err) {
        console.error("Error creando admin:", err.message);
    }
}

crearAdmin();