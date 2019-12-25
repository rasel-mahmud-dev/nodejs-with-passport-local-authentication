const path = require('path')
const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const cookieSession = require('cookie-session')
const expressSession = require('express-session')
const connectFlash = require('connect-flash')


// import app all keys
const keys = require('./config/keys')

// model........
require('./models/User')

// passport initial............
require('./passport/passportLocal')

// import auth roures........
const authRoutes = require('./routes/auth')


const app = express()
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(path.join(__dirname, 'public')))
app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(cookieSession({
  name:"app_name",
  maxAge: 7 * 24 * 60 * 60 * 1000,
  keys: [keys.COOKIE_SECRET]
}))
// ! or
// app.use(expressSession({
//   resave: true,
//   saveUninitialized: true,
//   secret: "Secret"
// }))

// flash message
app.use(connectFlash())


// passport session and initialize
app.use(passport.initialize())

// Set logged user obj inside req obj 
app.use(passport.session())


// Global Variable....... ( You access it from any ejs file )
app.use((req, res, next)=>{
  res.locals.error_flash = req.flash('error_flash')[0]
  res.locals.success_flash = req.flash('success_flash')[0]
  res.locals.currentUser = req.user ? req.user : null  
  next()
})


// check our auth status........
// app.use((req, res, next)=>{
//   console.log("req user", req.user);
//   console.log("req session", req.session);
//   next()
// })


// home page route.........
app.get('/', (req, res)=>{    
  res.render('home', { 
    pageTitle: "Home Page",
    path:"/"
  })
})


// routes registed......
app.use(authRoutes)



mongoose.connect(keys.MONGOURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(()=>{
    console.log('databased conneted...');
    app.listen(4001, ()=>console.log(`Server is Running on port http://localhost:4001`))
  }).catch(err=> console.log(err))