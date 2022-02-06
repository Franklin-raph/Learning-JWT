const jwt = require('jsonwebtoken')
const User = require('../model/User')

const requireAuth = (req, res, next) => {
    // Get token
    const token = req.cookies.jwt

    // check if jwt exists and is verified
    if(token){
        jwt.verify(token, 'frank secret key', (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.redirect('/signin')
            } else {
                console.log(decodedToken)
                next()
            }
        })
    }
    else{
        res.redirect('/signin')
    }
}

// check current user
const checkUser = (req, res, next) => {
    const token = req.cookies.jwt;

    if(token){
        jwt.verify(token, 'frank secret key', async (err, decodedToken) => {
            if(err){
                console.log(err.message)
                res.locals.user = null;
            } else {
                console.log(decodedToken)
                let user = await User.findById(decodedToken.id);
                res.locals.user = user
                next();
            }
        })
    }else{
        res.locals.user = null;
        next();
    }
}

module.exports = { requireAuth, checkUser };