const express =         require('express')
const morgan =          require('morgan')
const authroutes =      require('./routes/authroutes')
const app =             express()
const bp =              require('body-parser')
const mongoose =        require('mongoose')
const cookieParser =    require('cookie-parser')
const { requireAuth,checkUser } = require('./middleWare/authMiddleWare')


// Port declaration
const port = process.env.PORT || 8000

mongoose.connect('mongodb://localhost/learnjwt-dev')
    .then(() =>{
    // App listening at port 8000
    app.listen(port, () =>{
    console.log(`Server is running on port ${port} \nMongo Db is connected`)
        })
    }).catch( err => `An error occured while connection go Mongo Db`)

// middle-wares
app.use(express.static('public'))
app.use(morgan('tiny'))
app.use(bp.json())
app.use(bp.urlencoded({ extended: true }))
app.use(cookieParser())

// Render Engine
app.set('view engine', 'ejs')

// applying the check user middleware to every single get request
app.get('*', checkUser)

// admin Routes
app.use(authroutes)

// home route
app.get('/', (req, res) => {
    res.render('home')
})

app.get('/smoothies', requireAuth, (req, res) => {
    res.render("smoothies")
})


