const cors = require('cors');
const express = require('express');
const http = require('http');
const { socketConfig } = require('./config');
const socketIo = require('socket.io');
const router = require('./routes/index');
const { handleSocketConnection } = require('./controller/socketController');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use('/api', router);

const io = socketIo(server, socketConfig);
io.on('connection', handleSocketConnection);
app.set('io', io);

server.listen(process.env.PORT || 3001, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT || 3001}`);
});
