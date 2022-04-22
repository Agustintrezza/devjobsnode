const mongoose = require('mongoose');
const Usuarios = mongoose.model('Usuarios');
const multer = require('multer');
const shortid = require('shortid');

exports.subirImagen = (req, res, next) => {
    upload(req, res, function(error) {
        if(error) {
            if(error instanceof multer.MulterError) {
                return next();
            }
        }
        next();

})
}

//Opciones de Multer 
const configuracionMulter = {
    storage: fileStorage = multer.diskStorage({
                destination : (req, file, cb) => {
                   cb(null, __dirname+'../../public/uploads/perfiles');
                },  
                filename : (req, file, cb) => {
                 const extension = file.mimetype.split('/')[1];
                 cb (null, `${shortid.generate()}.${extension}`);
                }
}),
        fileFilter(req, file, cb) {
                    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
                        // el callback se ejecuta como true o false : true cuando la imagen se acepta
                        cb(null, true);
                    } else {
                        cb(null, false);
                    }
                }
}

const upload = multer(configuracionMulter).single('imagen');


// exports.subirImagen = (req, res, next) => {
//     upload(req, res, function(error) {
//         if(error) {
//             if(error instanceof multer.MulterError) {
//                 console.log(error)
//                 if(error.code === 'LIMIT_FILE_SIZE') {
//                     req.flash('error', 'El archivo es muy grande: Máximo 100kb ');
//                 } else {
//                     req.flash('error', error.message);
//                 }
//             } else {
//                 req.flash('error', error.message);
//             }
//             res.redirect('/administracion');
//             return;
//         } else {
//             return next();
//         }
//     });
// }
// // Opciones de Multer
// const configuracionMulter = {
    
//     limits : { fileSize : 100000 },
//     storage: fileStorage = multer.diskStorage({
//         destination : (req, file, cb) => {
//             cb(null, __dirname+'../../public/uploads/perfiles');
//         }, 
//         filename : (req, file, cb) => {
//             const extension = file.mimetype.split('/')[1];
//             cb(null, `${shortid.generate()}.${extension}`);
//         }
        
//     }),
//     fileFilter(req, file, cb) {
//         if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' ) {
//             // el callback se ejecuta como true o false : true cuando la imagen se acepta
//             cb(null, true);
//         } else {
//             cb(new Error('Formato No Válido'));
//         }
//     }
// }


exports.formCrearCuenta = (req, res) => {
    res.render('crear-cuenta', {
        nombrePagina: 'Crea tu cuenta en Devbojs',
        tagline: 'Comienza a publicar tus vacantes gratis, sólo debes crear una cuenta'
    })
}

exports.validarRegistro = (req, res, next) => {
    req.checkBody('nombre', 'El Nombre es Obligatorio').notEmpty();

    const errores = req.validationErrors();

    console.log(errores);

    return;
}

exports.crearUsuario = async (req, res, next) => {
    //crear el usuario
    const usuario = new Usuarios (req.body)

    try {
        await usuario.save();
        res.redirect('/iniciar-sesion');
    } catch (error) {
        req.flash('error', error);
        res.redirect('/iniciar-sesion');
    }


}

const {
    body,
    validationResult
} = require('express-validator');

exports.validarRegistro = async (req, res, next) => {
    //sanitizar los campos
    const rules = [
        body('nombre').not().isEmpty().withMessage('El nombre es obligatorio').escape(),
        body('email').isEmail().withMessage('El email es obligatorio').normalizeEmail(),
        body('password').not().isEmpty().withMessage('El password es obligatorio').escape(),
        body('confirmar').not().isEmpty().withMessage('Confirmar password es obligatorio').escape(),
        body('confirmar').equals(req.body.password).withMessage('Los passwords no son iguales')
    ];

    await Promise.all(rules.map(validation => validation.run(req)));
    const errores = validationResult(req);
    //si hay errores
    if (!errores.isEmpty()) {
        req.flash('error', errores.array().map(error => error.msg));
        res.render('crear-cuenta', {
            nombrePagina: 'Crea una cuenta en Devjobs',
            tagline: 'Comienza a publicar tus vacantes gratis, solo debes crear una cuenta',
            mensajes: req.flash()
        })
        return;
    }

    //si toda la validacion es correcta
    next();
}

// formulario para iniciar sesión
exports.formIniciarSesion = (req, res) => {
    res.render('iniciar-sesion', {
        nombrePagina : 'Iniciar Sesión devJobs'
    })
}

// Form editar el Perfil
exports.formEditarPerfil = (req, res) => {
    res.render('editar-perfil', {
        nombrePagina : 'Edita tu perfil den devJobs',
        usuario: req.user.toObject(),
        cerrarSesion: true,
        nombre: req.user.nombre,
    })
}

// Guardar cambios editar perfil
exports.editarPerfil = async (req, res) => {
    const usuario = await Usuarios.findById(req.user._id);
    console.log(usuario);

    usuario.nombre = req.body.nombre;
    usuario.email = req.body.email;
    if(req.body.password) {
        usuario.password = req.user.body.password
    }
   console.log(req.file);
   return;

    if (req.file) {
        usuario.imagen = req.file.filename;
    }
   
}

// sanitizar y validar el formulario de editar perfiles
exports.validarPerfil = (req, res, next) => {
    sanitizar
    req.sanitizeBody('nombre').escape();
    req.sanitizeBody('email').escape();
    if(req.body.password){
        req.sanitizeBody('password').escape();
    }
    validar
    req.checkBody('nombre', 'El nombre no puede ir vacio').notEmpty();
    req.checkBody('email', 'El correo no puede ir vacio').notEmpty();

    const errores = req.validationErrors();

    if(errores) {
        req.flash('error', errores.map(error => error.msg));

        res.render('editar-perfil', {
            nombrePagina : 'Edita tu perfil en devJobs',
            usuario: req.user,
            cerrarSesion: true,
            nombre : req.user.nombre,
            imagen : req.user.imagen,
            mensajes : req.flash()
        })
    }
    next(); // todo bien, siguiente middleware!
}
