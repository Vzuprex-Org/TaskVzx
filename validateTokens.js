const jwt=require('jsonwebtoken');
require('dotenv').config();

function tokenValidate(token){
    try{
        const pass=jwt.verify(token,process.env.FIRMA)
        console.log('token valido')
        return true
    }catch(err){
        return false
    }
}
module.exports={tokenValidate}