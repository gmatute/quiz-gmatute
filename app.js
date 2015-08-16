var express = require('express'); //Importar paquetes con Middlewares
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials'); // Agregar Marco de la aplicacion
var methodOverride = require('method-override'); // mdo 8 editar pregunta
var session = require('express-session'); // mod 9 Quiz 16: importar paquete

var routes = require('./routes/index'); // Importar enrutadores

var app = express();  // Crear aplicacion

// view engine setup
// Instalar generador de vistas EJS
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(partials()); // Layout

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());  // Instalar middlewares
app.use(bodyParser.urlencoded()); // modulo 8 modificacion { extended: false }));

app.use(cookieParser('Quiz-gmatute')); //
app.use(session()); //

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Mod 9 - Quiz 16 Helpers dinamicos
app.use(function(req, res, next) {

  // si no existe lo inicializa
  if (!req.session.redir) {
    req.session.redir = '/';
  }
  // guardar path en session.redir para despues de login
  //if (!req.path.match(/\/login|\/logout/)) {
  if (req.method === 'GET' && !req.path.match(/\/login|\/logout/)) {
    req.session.redir = req.path;
  }

  // Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

// Autologout
app.use(function(req, res, next) {
    // Comprobamos si hay usuario logado
    if (req.session.user) {
        var dateNow = new Date();
        var timeNow = dateNow.getTime();

        var lastAccessDiffMinutes = (timeNow - req.session.ultimoAcceso) * 1.6667 * Math.pow(10, -5);
        if (lastAccessDiffMinutes > 2) {

            delete req.session.user;
            delete req.session.ultimoAcceso;
            req.session.errors = [{"message": 'Su sesión ha estado desiado tiempo inactiva y ha finalizado. Por favor, vuelva a identificarse.'}];
            //req.session.errors = [{"message": 'Se ha producido un error: '+error}];
            res.redirect("/login");
        } else {
            req.session.ultimoAcceso = timeNow;
        }
    }
    next();
});


// Instalar enrutadores y asociar rutas a sus gestores
app.use('/', routes);     // Ruta base, Home

// catch 404 and forward to error handler
// Configurar rutas que no atienda los anteriores enrutadore
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;  // resto de rutas
    next(err); // genera error 404 de HTTP
});


// gestión de errores durante el desarrollo
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: [] // mod 8 Validation
    });
});

// exportar app para comando de arranque
module.exports = app;
