const socketio = require('socket.io');
const io = socketio();

io.on("connection", socket => {
});

module.exports = io;