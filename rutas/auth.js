const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verificarJWT = require("../middlewares/jwtMiddleware");
const verificarRol = require("../middlewares/rolMiddleware");
module.exports = ( loginLimiter) => {
    
    router.post("/register", authController.register);
    router.post("/login", loginLimiter, authController.login);
    router.get("/perfil", authController.perfilCookie);
    router.post("/logout", authController.logout);
    router.get("/perfil-jwt", verificarJWT, authController.perfilJWT);

    // Dashboard de administrador
    router.get("/admin-dashboard", verificarJWT, verificarRol("administrador"), authController.dashboard);
    return router
};
