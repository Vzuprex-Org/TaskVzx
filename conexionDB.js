const mysql = require('mysql2/promise');
require('dotenv').config();

let conexion;
async function conectarDB() {

    try{
        conexion = await mysql.createConnection(
            {
            user: process.env.USUARIO,
            password: process.env.PASSWORD,
            host: process.env.HOST,
            port: process.env.PORT,
            database: process.env.DATABASE
            }
        );

        console.log('[-*] Conexion a la BD ha sido creada.')

    }catch(err){

        console.log('[-*] Conexion a la BD ha sido fallida.')
        return

    }

}

async function consultarDB(query,dates) {
    const [resQuery]=await conexion.execute(query,[dates[0],dates[1]]);
    const datos=resQuery[0];
    console.log('(*) Consulta a la DB fue realizada.');
    return datos
}


module.exports={conectarDB,consultarDB}





