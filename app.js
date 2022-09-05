if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require('express')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
//package (or engine) used for layout and using a boilerplate on our project
const ejsMate = require('ejs-mate')
const ExpressError = require('./utils/ExpressError')
const methodOverride = require('method-override')
const session = require('express-session')
const flash = require('connect-flash')
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews')
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')
const userRoutes = require('./routes/users')
const mongoSanitize = require('express-mongo-sanitize')
const dbUrl = process.env.DB_URL
const MongoDBStore = require("connect-mongo")

//'mongodb://localhost:27017/yelp-camp'

mongoose.connect('mongodb://localhost:27017/yelp-camp', {useNewUrlParser:true, useUnifiedTopology:true})

const db =  mongoose.connection
db.on("error", console.error.bind(console,"connection error"))
db.once("open", () => {
    console.log("database connected")
})

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize())

const store = MongoDBStore.create({
    mongoUrl:'mongodb://localhost:27017/yelp-camp',
    touchAfter: 24*3600,
    crypto: {
        secret: 'secret'
    }
})

store.on('error', function(){
    console.log('session store error')
})

const sessionConfig = {
    name: 'session',
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        // secure: true,
        expires: Date.now() + 1000 * 60  * 60 * 24 * 7,
        maxAge: 1000 * 60  * 60 * 24 * 7 
    }
}

app.use(session(sessionConfig))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next) =>{
  console.log(req.session)
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currentUser = req.user
  next()
})

app.get('/fakeuser', async (req,res) => {

    const user = new User({
        email: 'isaac@gmail.com',
        username: 'isaac'
    })

    const newUser = await User.register(user,'chicken')

    res.send(newUser)
})

app.use('/', userRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews', reviewRoutes)


app.get('/', (req,res) => {
    res.render('home')
})


app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found',404))
})

app.use((err,req,res,next) => {
    const {statusCode = 500} = err
    if(!err.message){
        err.message = 'Something went wrong!'
    }
    res.status(statusCode).render('error', {err})
})

const port = process.env.PORT

app.listen(port, () =>{
    console.log(`serving on port ${port}`)
})