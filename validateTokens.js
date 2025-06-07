const { json } = require('express');
const jwt=require('jsonwebtoken');
require('dotenv').config();

function tokenValidate(token){
    try{
        const pass=jwt.verify(token,process.env.FIRMA)
        console.log('token valido')
        console.log(pass)
        return {token:true,user:pass.username}
    }catch(err){
        return false
    }
}
module.exports={tokenValidate}