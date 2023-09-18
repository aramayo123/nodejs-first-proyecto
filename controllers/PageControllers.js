//con esto vamos a controlar la paginacion, o bueno mejor dicho crear variables de control o funciones que luego 
//utilizaremos en routes
/* ADMINISTRACION */
const vistaAdminPrincipal = (req,res) => {
    res.render('admin/home', {user: req.user});
}
const vistaAdminTables = (req,res) => {
    res.render('admin/tables', {user: req.user});
}
const vistaAdminNotifications = (req,res) => {
    res.render('admin/notifications', {user: req.user});
}
const vistaAdminIcons = (req,res) => {
    res.render('admin/icons', {user: req.user});
}
const vistaAdminMaps = (req,res) => {
    res.render('admin/maps', {user: req.user});
}
const vistaAdminUser = (req,res) => {
    res.render('admin/user', {user: req.user});
    //console.log(req.user)
}
/* USUARIOS NORMALES */
const vistaPrincipal = (req,res) => {
    res.render('index', {user: req.user});
    //console.log(req.user);
}
const vistaLogin = (req,res) => {
    res.render('login');
}
const vistaRegistro = (req,res) => {
    res.render('register');
}
const vistaLogout = (req,res) =>{
    res.render('logout')
}

module.exports = {
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
} // exportamos para usar en router.js