const express = require("express");
const router = express.Router();
const homeController = require('../controllers/homeController');
const vacantesController = require('../controllers/vacantesController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');




module.exports = () => {
  router.get('/', homeController.mostrarTrabajos,
  authController.verificarUsuario,
  authController.mostrarPanel);

  //CrearVacantes
  router.get('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.formularioNuevaVacante
        );
  router.post('/vacantes/nueva', 
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.agregarVacante
        );


  //Mostrar Vacante Ünica (singular)
  router.get('/vacantes/:url',
  authController.verificarUsuario,
  vacantesController.mostrarVacante);

  // Editar Vacante
  router.get('/vacantes/editar/:url',
        authController.verificarUsuario,
        vacantesController.formEditarVacante
        );
  router.post('/vacantes/editar/:url', 
        authController.verificarUsuario,
        vacantesController.validarVacante,
        vacantesController.editarVacante
        );

  // Eliminar Vacantes
  router.delete('/vacantes/eliminar/:id',
    vacantesController.eliminarVacante
  );

  // Crear cuentas 
  router.get('/crear-cuenta', usuariosController.formCrearCuenta);
  router.post('/crear-cuenta', 
    usuariosController.validarRegistro,
    usuariosController.crearUsuario
  );

  // Autenticar Usuarios
  router.get('/iniciar-sesion', usuariosController.formIniciarSesion );
  router.post('/iniciar-sesion', authController.autenticarUsuario );
  
  // Cerrar Sesión
  router.get('/cerrar-sesion',
  authController.verificarUsuario,
  authController.cerrarSesion);

  // Panel de Administración
  router.get('/administracion',
    authController.verificarUsuario,
    authController.mostrarPanel);

  //Editar perfil
  router.get('/editar-perfil',
    authController.verificarUsuario,
    usuariosController.formEditarPerfil
    );
  router.post('/editar-perfil',
    authController.verificarUsuario,
    // usuariosController.validarPerfil,
    usuariosController.subirImagen,
    usuariosController.editarPerfil
  )

  // Buscador de Vacantes 
  router.post('/buscador', vacantesController.buscarVacantes);
  return router;
};
