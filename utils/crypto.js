const crypto = require("crypto");

// Clave secreta de 32 bytes (podés moverla a .env en producción)
const SECRET_KEY = Buffer.from("000102030405060708090a0b0c0d0e0f101112131415161718191a1b1c1d1e1f", "hex");

// Cifrar texto
function cifrar(texto) {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv("aes-256-cbc", SECRET_KEY, iv);
    let encrypted = cipher.update(texto, "utf8", "hex");
    encrypted += cipher.final("hex");
    return { iv: iv.toString("hex"), data: encrypted };
}

// Descifrar texto
function descifrar(encrypted) {
    const iv = Buffer.from(encrypted.iv, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", SECRET_KEY, iv);
    let decrypted = decipher.update(encrypted.data, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}

module.exports = { cifrar, descifrar };