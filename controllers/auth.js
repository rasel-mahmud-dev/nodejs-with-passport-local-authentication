const passport = require('passport')
const Joi = require('@hapi/joi')
const bcryptjs = require('bcryptjs')
const _ = require('lodash')


const User = require('mongoose').model("User")


exports.getLoginPage = (req, res)=>{
  res.render('login', { 
    pageTitle: "Login Page",
    path:"/login",
    errorsField: {}
  })
}


exports.login = async (req, res, next)=>{
  const schema = Joi.object({
    email: Joi
    .string()
    .email({minDomainSegments:2, tlds:{allow:['com', 'net']}})
    .required(),
    password: Joi.string().min(3).required()
  })


  try{
    //| initial user given input validate........
    const { error } = schema.validate(req.body, { abortEarly: false })
    if(error) {
      const customError = new Error();
      customError.statusCode = 401
      customError.error = error
      throw customError;      
    }

    //< Manually Database query && ==> after validate.......
    // let user = await User.findOne({email: req.body.email})
    // if(!user){
    //   const customError = new Error()
    //   customError.statusCode = 401
    //   const newError = { details: [ { message: "This Email is not yet Registered", path:['email']}] }
    //   customError.error = newError;
    //   throw customError;
    // }


    //_ if u put it bottom u need call it with (req, res, next) and we got more control
    // Passport hit............
    passport.authenticate('local', (err, user, info)=>{ 

      //_ this callback custom cb extend more control  
      // when we throw error from passport strategy ( password not or user not found )
      if(info){         
    
        return res.render('login', {
          pageTitle: "Login",
          path:"/login",
          errorsField: { [info.path]  : info.message },
          error_flash: info.message
          //> req.flash not work here. cause it need reload to get cookie inside store message.
        })  
      }

      if(!user) return res.redirect("/login")

      req.logIn(user, function(err){
        if(err) return next(err)
        req.flash("success_flash", "Login Success...")
        return res.redirect('/')
      })
    })(req, res, next)


  } catch(ex){    
    const errors = {}     
    if(ex.error){
      for(let error of ex.error.details){
        errors[error.path[0]] = error.message
      }
    }

    res.render('login', {
      pageTitle: "Login",
      path:"/",
      errorsField: errors,
      error_flash: "Validation Error....."
    })  
  }
}


exports.getRegisterPage = (req, res)=>{
  res.render('register', {
    pageTitle: "Register Page", 
    path:"/register",
    errorsField: {}
  })
}


exports.register = async (req, res, next)=>{
  const schema = Joi.object({
    username:Joi
      .string()
      .min(3)
      .required(),
    email: Joi
      .string()
      .email({minDomainSegments:2, tlds:{allow:['com', 'net']}})
      .required(),
    password: Joi
      .string()
      .min(3)
      .required(),
    confirmPassword: Joi
      .string()
      .min(3)
      .required(),
  })

  try{
    const { error } = schema.validate(req.body, { abortEarly: false })    
    if(error){
      let customError = new Error()
      customError.statusCode = 401;
      customError.error = error;
      throw customError;
    }

    let user = await User.findOne({email: req.body.email})
    if(user){
      const newError = { details:[{message: 'This Email Already registered', path:['email']}] }

      let customError = new Error();
      customError.statusCode = 401;
      customError.error = newError
      throw customError;
    }

    if(req.body.password !== req.body.confirmPassword){
      const newError = { details:[{message: "password Does'nt match", path:['confirmPassword']}]} 
      let customError = new Error();
      customError.statusCode = 401;
      customError.error = newError
      throw customError;
    }

    let salt = await bcryptjs.genSalt(10)    
    let hashedPassword = await bcryptjs.hash(req.body.password, salt)

    user = await new User({..._.pick(req.body, ['email', 'username']), password: hashedPassword}).save()
    req.flash("success_flash", "User Registration Successfull")
    res.redirect('/login')
    
  } catch(ex){
    let errors = {}
    if(ex.error){
      for(let error of ex.error.details){
        errors[error.path[0]] = error.message
      }
    }    
    res.render('register', {
      pageTitle: "Register Page", 
      path:"/register",
      errorsField: errors,
      error_flash: "Validation Error....."
    })
  }
}


exports.logout = (req, res, next)=>{
  req.logOut()
  req.flash('success_flash', 'Log out Success.....' )
  res.redirect("/login")
}


exports.getDashboardPage = (req, res, next)=>{

  res.render('dashboard', {
    pageTitle: "User Dashboard", 
    path:"/dashboard",
    errorsField: {},
  })
}