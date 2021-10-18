const socketio = require('socket.io');
const io = socketio();

io.on("connection", socket => {
    // console.log(socket.id)
});

module.exports = io;