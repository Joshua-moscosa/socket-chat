const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');
const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', function(usuario, callback) {

        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                message: 'El nombre/sala es necesario'
            });
        }

        client.join(usuario.sala);
        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        callback(usuarios.getPersonasPorSala(usuario.sala));
    });

    client.on('crearMensaje', (data) => {

        console.log(data.sala);

        let persona = usuarios.getPersona(client.id);

        let mensaje = crearMensaje(persona.nombre, data.mensaje);

        client.broadcast.to(data.sala).emit('crearMensaje', mensaje);
    });

    client.on('disconnect', () => {

        let persona = usuarios.borrarPersona(client.id);

        client.broadcast.to(persona.sala).emit('crearMensaje', crearMensaje('Administrador', `${ persona.nombre } left`));

        client.broadcast.to(persona.sala).emit('listaPersonas', usuarios.getPersonasPorSala(persona.sala));
    });

    // Mensajes privados 

    client.on('mensajePrivado', (data) => {

        let persona = usuarios.getPersona(client.id);

        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    })


});