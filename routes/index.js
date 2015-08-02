var express = require('express');
var router = express.Router();
var quizController = require('../controllers/quiz_controller');


// Autoload de comandos con :quizId
router.param('quizId', quizController.load);  // autoload :quizId

/* GET home page. */
router.get('/', function(req, res) {
  //res.render('index', { title: 'Quiz' });
    res.render('index', { title: 'Quiz', errors: [] });
});

// Definición de rutas de /quizes
router.get('/quizes',                      quizController.index);
router.get('/quizes/:quizId(\\d+)',        quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
// modulo 8 Crear preguntas
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);
// modulo 8 Editar preguntas
router.get('/quizes/:quizId(\\d+)/edit', quizController.edit);
router.put('/quizes/:quizId(\\d+)', quizController.update);
// modulo 8 Borrar preguntas
router.delete('/quizes/:quizId(\\d+)', quizController.destroy);


router.get('/author', quizController.author);

module.exports = router;
