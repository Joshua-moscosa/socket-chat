var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = "index.html";
    throw new Error('El nombre y sala son necesarios');

}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
};

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        console.log("Usuarios conectados: ", resp);
    });
});

socket.on('disconnect', function() {
    console.log('Te desconectaste del servidor');
});

socket.on('crearMensaje', function(mensaje) {
    console.log("Servidor: ", mensaje);
});

/// Escuchar cambios de usuarios
/// Cuando un usuarios entra o sale del chat

socket.on('listaPersonas', function(data) {
    console.log(data);
});

/// Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje Privado: ', mensaje);
});