const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const connection = require('../database/db');
const {body, validationResult} = require('express-validator');
const {promisify} = require('util');

exports.register = async(req,res) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        const valores = req.body
        const validaciones = errors.array()
        res.render('register', {validaciones: validaciones, valores: valores});
        console.log(req.body)
    }else{
        const user = req.body.user;
        const name = req.body.name;
        const email = req.body.email;
        const pass = req.body.pass;
        const pass2 = req.body.pass2;
        if(user && name && email && pass && pass2){
            if(pass == pass2){
                console.log(req.body)
                let passwordHash = await bcrypt.hash(pass, 8);
                connection.query('SELECT * FROM users WHERE username = ?', [user], async (error, results, fields)=> {
                    if( results.length == 0){
                        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
                            if( results.length == 0){
                                connection.query('INSERT INTO users SET ?',{nombre:name, username:user, email:email, password:passwordHash, rol:0}, async (error, results)=>{
                                    if(error){
                                        console.log(error);
                                    }else{            
                                        res.render('register', {
                                            alert: true,
                                            alertTitle: "Registration",
                                            alertMessage: "¡Successful Registration!",
                                            alertIcon:'success',
                                            showConfirmButton: false,
                                            timer: 1500,
                                            ruta: '/login'
                                        });
                                        //res.redirect('/');         
                                    }
                                });
                            }else{
                                //console.log('el email ya existe');
                                res.render('register', {
                                    alert: true,
                                    alertTitle: "Error",
                                    alertMessage: "¡El email ya existe!",
                                    alertIcon:'error',
                                    showConfirmButton: true,
                                    timer: false,
                                    ruta: 'register',
                                    valores: req.body
                                });
                            }
                        });
                    }else{
                        //console.log('el usuario ya existe');
                        res.render('register', {
                            alert: true,
                            alertTitle: "Error",
                            alertMessage: "¡El usuario ya existe!",
                            alertIcon:'error',
                            showConfirmButton: true,
                            timer: false,
                            ruta: 'register',
                            valores: req.body
                        });
                    }
                });    
            }else{
                //console.log('contraseñas no coinciden');
                res.render('register', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "¡Las contraseñas no coinciden!",
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'register',
                    valores: req.body
                });
            }
        }else{
            //console.log('rellene todos los campos');
            res.render('register', {
                alert: true,
                alertTitle: "Error",
                alertMessage: "¡Rellene todos los campos!",
                alertIcon:'error',
                showConfirmButton: true,
                timer: false,
                ruta: 'register',
                valores: req.body
            });
        }
    }
}
exports.login = async(req,res) =>{
	const email = req.body.email;
	const pass = req.body.pass;
    if(email && pass) {
        connection.query('SELECT * FROM users WHERE email = ?', [email], async (error, results, fields)=> {
            if(results.length == 0 || !(await bcrypt.compare(pass, results[0].password))) {   
                res.render('login', {
                    alert: true,
                    alertTitle: "Error",
                    alertMessage: "EMAIL y/o PASSWORD incorrectas",
                    alertIcon:'error',
                    showConfirmButton: true,
                    timer: false,
                    ruta: 'login'    
                });
            }else{
                //inicio de sesión OK
                const id = results[0].id
                const token = jwt.sign({id:id}, process.env.JWT_SECRETO, {
                    expiresIn: process.env.JWT_TIEMPO_EXPIRA
                })
                    //generamos el token SIN fecha de expiracion
                //const token = jwt.sign({id: id}, process.env.JWT_SECRETO)
                //console.log("TOKEN: "+token+" para el USUARIO : "+email)
                const cookiesOptions = {
                    expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                    httpOnly: true
                }
                res.cookie('jwt', token, cookiesOptions)
                // fin de inicio de sesion
				res.render('login', {
					alert: true,
					alertTitle: "Conexión exitosa",
					alertMessage: "¡LOGIN CORRECTO!",
					alertIcon:'success',
					showConfirmButton: false,
					timer: 800,
					ruta: '/admin/'
				});        	
            }
            res.end();
        });
    }else{
        res.render('login', {
            alert: true,
            alertTitle: "Error",
            alertMessage: "Por favor rellene todos los campos",
            alertIcon:'error',
            showConfirmButton: true,
            timer: false,
            ruta: 'login'    
        });
		res.end();
    }
}
exports.isAuthenticated = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        res.redirect('/login')        
    }
}
exports.isNoAuthenticated = async (req, res, next)=>{
    if(req.cookies.jwt) {
        res.redirect('/admin/')
    }else{
        return next();
    }
}
exports.recogerDatos = async (req, res, next)=>{
    if (req.cookies.jwt) {
        try {
            const decodificada = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRETO)
            connection.query('SELECT * FROM users WHERE id = ?', [decodificada.id], (error, results)=>{
                if(!results){return next()}
                req.user = results[0]
                return next()
            })
        } catch (error) {
            console.log(error)
            return next()
        }
    }else{
        return next()
    }
}
exports.logout = (req, res)=>{
    res.clearCookie('jwt')   
    return res.redirect('/login')
}


