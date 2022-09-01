const { Router } = require('express')
const  {crear_pregunta, cargarPreguntas, cargarRespuestas} = require('../db/preguntas')

const router = Router()

// Vamos a crear un middleware para ver si el usuario está logueado o no
function protected_route (req, res, next) {
  if (!req.session.user) {
    req.flash('errors', 'Debe loguearse primero')
    return res.redirect('/login')
  }
  // si llegamos hasta acá, guardamos el usuario de la sesión en una variable de los templates
  res.locals.user = req.session.user;
  // finalmente, seguimos el camino original
  next()
}

router.get('/', protected_route, (req, res) => {
  res.render('index.html')
})

router.get('/new_question', protected_route,async (req, res) => {
  res.render('new_question.html')
})

router.post('/new_question',async(req,res)=>{
  const pregunta = req.body
  await crear_pregunta (pregunta.pregunta, pregunta.respuesta_1, pregunta.respuesta_2, pregunta.respuesta_3, pregunta.respuesta_4, pregunta.respuesta_5 )
  console.log()
  res.redirect(('/'))
})
// async function respuestadesordenadas(id){
//   let respuestas= await cargarRespuestas(id)
//   let largo = respuestas.length
//   let posicion = Math.floor(Math.random()*respuestas.length)
//   console.log(respuestas,largo,posicion);
// }
// respuestadesordenadas(2)
router.get('/lets_play', protected_route, async (req, res) => {
  let preguntas=await cargarPreguntas()
  preguntas[0].respuestas = [
    {
      value: 'correcta',
      text: preguntas[0].respuesta_correcta
    },
    {
      value: 'incorrecta',
      text: preguntas[0].respuesta_1
    },
    {
      value: 'incorrecta',
      text: preguntas[0].respuesta_2
    },
    {
      value: 'incorrecta',
      text: preguntas[0].respuesta_3
    },
    {
      value: 'correcta',
      text: preguntas[0].respuesta__4
    },
  ]
  preguntas[0].respuestas = preguntas[0].respuestas.sort( (elem1, elem2) => Math.random() - 0.5)
  console.log(preguntas[0].respuestas);
  res.render('lets_play.html',{preguntas})
})

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;