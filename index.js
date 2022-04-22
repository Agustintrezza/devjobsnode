require('./config/db');
require('dotenv').config({ path: 'variables.env'})


const mongoose = require('mongoose');
const express = require('express');
const exphbs = require('express-handlebars');
const router = require('./routes');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const passport = require('./config/passport');
const cors = require('cors');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');
// const expressValidator = require('express-validator');



const app = express(); 

// validación de campos
app.use(expressValidator());

// Configurar CORS
app.use(cors());

//habilitar body-parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// validacion de campos
// app.use(expressValidator());

// app.engine('handlebars',
//     exphbs.engine({
//         defaultLayout: 'layout',
//         helpers: require('./helpers/handlebars')
//     })
// );

//habilitar handlebars como view
app.engine('handlebars',
    exphbs.engine({
        handlebars: allowInsecurePrototypeAccess(Handlebars),
        defaultLayout: 'layout',
        helpers: require('./helpers/handlebars')
    })
);

app.set('view engine', 'handlebars');

// Archivos Estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

//session

app.use(session({
    secret: process.env.SECRET || 'secret',
    key: process.env.KEY || 'keysecret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: process.env.DATABASE || 'mongodb://localhost:27017/devjobs'
    })
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());

// Alertas y flash messages
app.use(flash());

// Crear nuestro middleware
app.use((req, res, next) => {
    res.locals.mensajes = req.flash();
    next();
});

app.use('/', router());

app.use(express.static('public/img'));


const host = '0.0.0.0';
const port = process.env.PUERTO;

app.listen(port, host, () => {
    console.log('El servidor esta funcionando');
});
// app.listen(process.env.PUERTO); 