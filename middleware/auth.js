

exports.isAuth = (req, res, next)=>{  
  if(req.user){
    return next()
  }
  return res.redirect('/login')
}

exports.notAuth = (req, res, next)=>{
  if(!req.user){
    return next()
  }
  return res.redirect('/')
}