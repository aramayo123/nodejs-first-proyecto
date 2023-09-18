const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const dotenenv = require('dotenv');

const app = express(); // iniciamos el proyecto, basicamente express maneja todo
//declaramos el motor de plantillas que basicamente con esto todas las extensiones de vista deben ser ejs
app.set('view engine', 'ejs')
// con esto hacemos referencia a que nuestra carpeta raiz va a ser public, o bueno donde vamos a tener nuestros archivos
// estaticos como ser css, scripts, imagenes etc
app.use(express.static(path.join(__dirname, 'public')));

//2- seteeamos urlencoded para capturar los datos del formulario
app.use(express.urlencoded({extended:true}));
app.use(express.json());

dotenenv.config({path:'./env/.env'});

// para usar las cookies
app.use(cookieParser());

//usamos el router
const router = require('./routes/router'); // aca llamamos a la libreria
app.use(router.routes); // aca lo acomplamos o usamos

//función para limpiar la caché luego del logout
app.use(function(req, res, next) {
    if (!req.user)
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    next();
});

//inicializamos el puerto
app.listen(process.env.PORT || 3000, () =>{
    console.log("server iniciado en el puerto 3000");
})