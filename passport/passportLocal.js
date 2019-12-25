const passport = require('passport')
const LocalStrategey = require('passport-local').Strategy
const bcryptjs = require('bcryptjs')
const mongoose = require('mongoose')
const _ = require("lodash")

const User = mongoose.model("User")


passport.use(
  new LocalStrategey({usernameField: 'email'},
  async (email, password, done)=>{    
    const user = await User.findOne({email})
    if(!user) return done(null, false, { message: "Not Register via this Email Yet", path: 'email'})   

    const matched = await bcryptjs.compare(password, user.password)
    if(!matched){
      return done(null, false, { message: "Invalid Password", path: 'password' } )
    }
    return done(null, user._id)
  })
)

// get user after done() fun call  
// set it memory ==> req session (get it req.session)
passport.serializeUser((id, done)=>{
  done(null, id)
})

// set it current user inside req object..... (get it req.user)
passport.deserializeUser((userId, done)=>{
  User.findById(userId, (err, user)=>{
    done(err, _.pick(user, ['username', 'email', '_id']))
  })
})

