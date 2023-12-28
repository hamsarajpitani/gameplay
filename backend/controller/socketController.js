const { removeData } = require('../services/globalServices');

const handleSocketConnection = (socket) => {
  socket.emit('message', 'Connected to Socket.io server');
};

module.exports = { handleSocketConnection };
