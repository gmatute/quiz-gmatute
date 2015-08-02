var models= require('../models/models.js');
// Autoload - factoriza el código si ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.findById(quizId).then(
    function(quiz) {
     if (quiz) {
        req.quiz = quiz;
        next();
      } else {
        next(new Error('No existe quizId=' + quizId + ' por favor, revisa el código de pregunta')); }
    }
  ).catch(function(error) { next(error);});
};

// modulo 7 Busquedas
exports.index = function(req, res) {
  var where = {};
  var buscar = req.query.search || '';
  if(buscar) {
    where = {where: ["pregunta like ?", '%' + buscar.replace(' ', '%') + '%'], order: 'pregunta'};
  }
  models.Quiz.findAll(where).then(function(quizes) {
    res.render('quizes/index.ejs', {quizes: quizes, query: buscar});
  }
  ).catch(function(error) { next(error);} );
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/answer
exports.answer = function(req,res) {
  var resultado = 'Incorrecto';
  if(req.query.respuesta.toLowerCase() === req.quiz.respuesta.toLowerCase()) {
    resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

  //if (req.query.respuesta === 'Roma')
  //{
  //  res.render('quizes/answer', {respuesta: 'Correcto'});
  //} else {
//    res.render('quizes/answer', {respuesta: 'Incorrecto'});
//  };
//};
exports.author = function(req,res) {
  res.render('author');
};
