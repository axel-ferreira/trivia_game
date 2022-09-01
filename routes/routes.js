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

router.get('/lets_play', protected_route, async (req, res) => {
  let preguntas=await cargarPreguntas()
  
  let respuestas = preguntas.map(async prg =>{
    const id= prg.id
    let res = await cargarRespuestas(id)
    console.log('1',prg)
    return prg;
  })
  console.log('2',respuestas)
  res.render('lets_play.html',{preguntas})
})

router.get('*', (req, res) => {
  res.render('404.html')
})

module.exports = router;