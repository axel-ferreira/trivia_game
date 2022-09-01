const pool = require('./pool.js')

async function create_table () {
  // 1. Solicito un 'cliente' al pool de conexiones
  const client = await pool.connect()

  // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
  await client.query(`
    create table if not exists preguntas (
      id serial primary key,
      pregunta text not null,
      respuesta_correcta varchar (255) not null,
      respuesta_1 varchar(255) not null,
      respuesta_2 varchar(255) not null,
      respuesta_3 varchar(255),
      respuesta_4 varchar(255)
    )
  `)
  // 3. Devuelvo el cliente al pool
  client.release()
}
create_table()
async function crear_pregunta(pregunta, respuesta_1, respuesta_2, respuesta_3, respuesta_4, respuesta_5) {
    // 1. Solicito un 'cliente' al pool de conexiones
    const client = await pool.connect()
    // 2. Ejecuto la consulta SQL (me traigo un array de arrays)
    const { rows } = await client.query(
      `insert into preguntas (pregunta, respuesta_correcta, respuesta_1, respuesta_2, respuesta_3, respuesta_4) values ($1, $2, $3, $4, $5, $6)`,
      [pregunta, respuesta_1, respuesta_2, respuesta_3, respuesta_4, respuesta_5]
    )
    // 3. Devuelvo el cliente al pool
    client.release()
   // return rows[0]
  }

const cargarPreguntas = async()=>{
    const client= await pool.connect()
    const preguntas=await client.query({
        text:`select * from preguntas order by random() limit 3;`
        // rowMode: 'array' 
    })
  
    client.release()
    return preguntas.rows
}
const cargarRespuestas = async(id)=>{
    const client= await pool.connect()
    const respuesta=await client.query({
        text:`select respuesta_correcta,respuesta_1,respuesta_2,respuesta_3,respuesta_4 
        from preguntas where id =$1;`,
        values:[id],
        rowMode: 'array' 
    })
   //console.log(respuesta.rows)
    client.release()
    return respuesta.rows[0]
}



module.exports={cargarRespuestas, cargarPreguntas,crear_pregunta}