const express = require('express');
const app = express();
const path = require('path');
const jwt = require('jsonwebtoken');
//funciones DB
const {conectarDB,consultarDB,ingresarDatosDB}=require('./conexionDB.js');
//validateToken
const{tokenValidate}=require('./validateTokens.js');



//Conectar DB
(async()=>{
     try{
        await conectarDB()
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
        
        const resQuery=await consultarDB('SELECT usuario.id,usuario.nombre FROM usuario WHERE (usuario.nombre=? OR usuario.correo=?) AND usuario.contrasena=?',[username,username,password]);
        if(resQuery.length===0){
            return res.json({autenticado:'no'})
        }else{
            const paylaod={
                id_user:resQuery[0].id,
                username:resQuery[0].nombre
            }
            const tokenAcess=jwt.sign(paylaod,process.env.FIRMA,{'expiresIn':'24h'})
            return res.json({autenticado:'si',token:tokenAcess})
            
            
        }

    }catch(err){
        console.log('[-*] Consulta a la DB no se realizo: ',err)
        return
    }



});
// roetePanel get
app.get('/panel',(req,res)=>{
    res.sendFile(path.join(__dirname , 'public', 'main-page', 'main-page.html'))
})
//routePanel post
app.post('/panel',(req,res)=>{
    const {token}=req.body

    if(!token){
        return res.sendFile(path.join(__dirname ,'public', 'main-page', 'no-found-404.html'))
    }
    
        const ress=tokenValidate(token)
        if(ress.token===true){
            console.log(ress)
            return res.json({token:'Validated',user:ress.user})
        }
    
    
        //enviar tareas del usuario
    
})
//routeRegister post
app.post('/register',async(req,res)=>{
    const {nombre,email,contraseña}=req.body
    const register= await consultarDB('SELECT usuario.nombre FROM usuario WHERE usuario.nombre=? OR usuario.correo=?',[nombre,email])
    if(register.length===0){
        await ingresarDatosDB('INSERT INTO usuario (nombre,correo,contrasena) values(?,?,?)',[nombre,email,contraseña])
        return 
    }
    console.log(register[0].nombre + ' ya esta registrado')
    res.json({registrado:false,usuario:register[0].nombre})
    
})

app.listen(3000, (err) => {
    if (err) {
        console.log('Error al levantar el server');
    } else {
        console.log('Server iniciado en el puerto 3000');
    }
});
