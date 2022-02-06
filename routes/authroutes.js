const express = require('express')
const router = express.Router()
const User = require('../model/User')
const jwt = require('jsonwebtoken')

const handleErrors = (err) => {
    console.log(err.message, err.code)
    let errors = {email: '', password: ''}

    // incorrect email during login
    if(err.message === 'Incorrect Email'){
        errors.email = "Incorrect Email"
    }

    // incorrect password during login
    if(err.message === 'Incorrect Password'){
        errors.password = "Incorrect Password"
    }

    // Duplicate key
    if(err.code === 11000){
        errors.email = "Email already exists"
        return errors
    }

    // Validate  errors
    if(err.message.includes('user validation failed')){
        Object.values(err.errors).forEach(({properties}) => {
            errors[properties.path] = properties.message
        })
    }
    return errors
}

const createToken = (id) => {
    return jwt.sign({ id }, 'frank secret key', {
        expiresIn: 60 * 60 * 24 * 3
    })
}

router.get('/signup', (req, res) => {
    res.render('signup')
})

router.post('/signup', async (req, res) => {
    const {email, password} = req.body

    try{
        const user = await User.create({email, password});
        res.status(201).json({ user: user._id })
        // console.log(token)
    }
    catch (err) {
        const errors = handleErrors(err)
        res.status(400).json({errors})
    }
})

router.get('/signin', (req, res) => {
    res.render("signin")
})

router. post('/signin', async (req, res) => {
  
  const {email, password} = req.body
  
  try{
    const user = await User.login(email, password);
    const token = createToken(user._id)
    res.cookie('jwt', token, { httpOnly: true, maxAge: 60 * 60 * 24 * 3 * 1000 })
    res.status(200).json({ user: user._id })
  }catch(err){
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
  
})

router.get('/signout', (req, res) => {
    res.cookie('jwt','', { maxAge: 1 })
    res.redirect("/")
})


module.exports = router;