const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const {body, validationResult} = require('express-validator');
const {
    vistaAdminPrincipal,
    vistaAdminTables,
    vistaAdminNotifications,
    vistaAdminIcons,
    vistaAdminMaps,
    vistaAdminUser,
    vistaPrincipal,
    vistaLogin,
    vistaRegistro,
    vistaLogout
} = require('../controllers/PageControllers'); // creamos un objeto que es mas facil

router.get('/admin/',authController.isAuthenticated , vistaAdminPrincipal); // y hacemos uso de nuestro controlador asignandole esta ruta como raiz
router.get('/admin/tables', authController.isAuthenticated ,vistaAdminTables); // y hacemos uso de nuestro controlador asignandole esta ruta como raiz
router.get('/admin/notifications', authController.isAuthenticated ,vistaAdminNotifications); // y hacemos uso de nuestro controlador asignandole esta ruta como raiz
router.get('/admin/icons', authController.isAuthenticated ,vistaAdminIcons); 
router.get('/admin/maps', authController.isAuthenticated ,vistaAdminMaps); 
router.get('/admin/user', authController.isAuthenticated ,vistaAdminUser); 
router.get('/', authController.recogerDatos ,vistaPrincipal); 
router.get('/login', authController.isNoAuthenticated ,vistaLogin); 
router.get('/register', authController.isNoAuthenticated ,vistaRegistro); 
router.get('/admin/logout', authController.logout,vistaLogout)
router.get('/logout', authController.logout, vistaLogout)
// registramos los datos de la tabla registro
router.post('/register',[
    body('user', 'El usuario debe contener min: 8 caracteres')
        .isLength({min:8}),
    body('name', 'El nombre debe contener min: 8 caracteres')
        .isLength({min:8}),
    body('email', 'Ingrese un email valido')
        .isEmail()
        /*
    body('number', 'Ingrese un numero valido')    
        .exists()
        .isLength({min:8})
        .isNumeric()
        */
],authController.register);


router.post('/login',authController.login);
module.exports = {routes: router} // exportamos para usar en app.js