// Implementación express
const express = require('express');
const app = express();

// Http
const http = require('http');
const server = http.createServer(app);

// Path
const path = require('path');
const pathPublic = path.resolve(__dirname, '../public');

// Sockets
const socketIO = require('socket.io');
module.exports.io = socketIO(server);
require('./sockets/socket');

/// Configs
let port = process.env.PORT || 3000;
app.use(express.static(pathPublic));

///// Servidor
server.listen(port, (err) => {

    if (err) throw new Error(err);

    console.log(`Corriendo servidor en el puerto ${ port }`);
})