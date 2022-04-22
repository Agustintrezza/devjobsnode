const mongoose = require('mongoose');
const Vacante = mongoose.model('Vacante')

exports.mostrarTrabajos = async (req, res, next) => {

    const vacante = await Vacante.find().lean();

    if(!vacante) return next();

    res.render('home', {
        nombrePagina : 'devJobs',
        tagline : 'Encontrá y Publica empleos para Desarrolladores Web',
        barra: false,
        boton: true,
        cerrarSesion2: true,
        vacante
    })
}