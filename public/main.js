let alertMessages = document.querySelectorAll('.alert')

//< get all alert message and loop and function call dismiss alert...
alertMessages.forEach(alertMessage=>{
  dismissAlert(alertMessage)
  autoDismissAlert(alertMessage)
})


//< dismiss alert message after dismiss button.
function dismissAlert(alertMessage){
  alertMessage.querySelector('.dismissButton')
  .addEventListener('click', function(e){
    alertMessage.remove()
  })
}


//< auto dismiss alert message after 10 second.
function autoDismissAlert(alertMessage){
  setTimeout(()=>{
    alertMessage.remove()
  }, 10000)
}








