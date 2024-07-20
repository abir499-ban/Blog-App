const {validate} = require('../service/auth');

function checkAuth(cookieName){
    return(req,res,next)=>{
        const tokenCookieValue = req.cookies[cookieName];
        console.log("hello");
        if(!tokenCookieValue) return next();
        try{
            const userPayload = validate(tokenCookieValue);
            req.user = userPayload;
        }catch(error){}
        return next();
       

    }
}

module.exports = {
    checkAuth,
}