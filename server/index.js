
const http = require('http');
const httpHandler = require('./js/httpHandler');
const keypressHandler = require('./js/keypressHandler');
const server = http.createServer(httpHandler.router);
const socket = require('socket.io');
const io = socket(server);

keypressHandler.initialize(message => {
  console.log(message)
  io.emit('ghostmove', JSON.stringify({ move: message }));
});

const port = 3000;
const ip = '127.0.0.1';
server.listen(port, ip);

console.log('Server is running in the terminal!');
console.log(`Listening on http://${ip}:${port}`);