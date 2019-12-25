// ser up your all keys depends on environment 
if(process.env.NODE_ENV === 'production'){
  module.exports = require('./prod')
} else{
  module.exports = require('./dev')
}

