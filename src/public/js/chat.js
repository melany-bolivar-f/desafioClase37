const { logger } = require("../../utils/logger")

const socket = io()

const chatBox = document.getElementById('chatBox')
const messageLogs = document.getElementById('messageLogs')

Swal.fire({
    title: 'Email',
    input: 'text',
    text: 'Ingrese su email para ingresar al chat',
    allowOutsideClick: false,
    inputValidator: value => {
        return !value && 'Necesitas llenar los campos para continuar'
    }
}).then(result => {
    user = result.value
    logger.info(user)
})

chatBox.addEventListener('keyup', evt => {
    if(evt.key === 'Enter'){
        if(chatBox.value.trim().length > 0){
            socket.emit('message', { user, message: chatBox.value })
            chatBox.value = ''
        }
    }
})

socket.on('messageLogs', (data) => {
    logger.info(`${data.user}: ${data.message}`)
    if (data && data.message) {
        const messageLogs = document.getElementById('messageLogs')
        messageLogs.innerHTML += `<p>${data.user}: ${data.message.message}</p>`
    }
})