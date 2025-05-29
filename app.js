const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
//funciones DB
const {conectarDB,consultarDB}=require('./conexionDB.js');
//validateToken
const{tokenValidate}=require('./validateTokens.js');



//Conectar DB
(async()=>{
     try{
        const DB= await conectarDB()
     }catch(err){
         console.log(err)
     }
})()

//Use express
app.use(express.json());



app.use(express.static(path.join(__dirname, 'public', 'login-page')));
app.use(express.static(path.join(__dirname, 'public', 'main-page')));


// routeDefault
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login-page', 'login-page.html'));
});

// routeAuth
app.post('/auth', async (req, res) => {
    
    const { username, password } = req.body;
    try{
        const usuario=[username,password]
        const resQuery=await consultarDB('SELECT usuario.id,usuario.nombre FROM usuario WHERE usuario.nombre=? AND usuario.contrasena=?',usuario)
        console.log(resQuery)
        if(resQuery===undefined){
            return res.json({autenticado:'no'})
        }else{
            const paylaod={
                username:resQuery.id,
                password:resQuery.nombre
            }
            const tokenAcess=jwt.sign(paylaod,process.env.FIRMA,{'expiresIn':'24h'})
            return res.json({autenticado:'si',token:tokenAcess})
            
            
        }

    }catch(err){
        console.log('[-*] Consulta a la DB no se realizo: ',err)
        return
    }



});
//get
app.get('/tareas',(req,res)=>{
    res.sendFile(path.join(__dirname , 'public', 'main-page', 'main-page.html'))
})
//post
app.post('/tareas',(req,res)=>{
    const {token}=req.body

    if(!token){
        res.sendFile(path.join(__dirname ,'public', 'main-page', 'no-found-404.html'))
    }
    if(tokenValidate(token)){
       return res.json({token:'Validated'})
        //enviar tareas del usuario
    }else{
        // res.sendFile(path.join(__dirname ,'public', 'main-page', 'no-found-404.html'))
    }
})

app.listen(3000, (err) => {
    if (err) {
        console.log('Error al levantar el server');
    } else {
        console.log('Server iniciado en el puerto 3000');
    }
});
