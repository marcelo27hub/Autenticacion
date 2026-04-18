const express = require("express");
const router = express.Router();
const authController = require("../controllers/authcontrollers");
const verificarJWT = require("../middlewares/jwtMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
const verificarSesionOCookie = require("../middlewares/verificarsesion0cookie");
module.exports = ( loginLimiter) => {

    // Formularios GET
    router.get("/login", authController.mostrarLogin);
    router.get("/register", authController.mostrarRegister);

    //formularios POST
    router.post("/login", loginLimiter, authController.login);
    router.post("/register", authController.register);
    router.post("/logout", authController.logout);

    // perfil
    router.get("/perfil", authController.mostrarPerfil)
    router.get("/perfil-jwt", verificarJWT, authController.perfilJWT);

    // Dashboard de administrador
    router.get("/admin", verificarSesionOCookie, verificarRol("administrador"), authController.verUsuarios);
    return router;
};
