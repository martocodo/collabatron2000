const express = require('express'),
  app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.get('/', (req, res) => {
  res.render('index');
});

server = app.listen(80);
const io = require('socket.io')(server);

console.log('I AM... ALIVE! on 127.0.0.1:80');

var lineHistory = [];
var colorsToPick = ['#00a97b', '#007656', '#0b55a7', '#00a5fd',
  '#533a71', '#7c57a9', '#f9c80e', '#be9805', '#d741a7', '#931f6e', '#d7263d', '#8f1929'];
var colorsActive = [];

// New Incoming Connections
io.on('connection', (socket) => {
  /////////////////////////////////////////////////////
  // Initial settings
  /////////////////////////////////////////////////////
  socket.color = colorsToPick.splice(Math.floor(Math.random() * colorsToPick.length), 1);
  colorsActive.push(socket.color);
  io.sockets.emit('users_online', { total: io.sockets.server.engine.clientsCount });
  /////////////////////////////////////////////////////
  // Drawing
  /////////////////////////////////////////////////////
  // Send the drawing history from server to new client
  lineHistory.forEach((lineData) => {
    socket.emit('draw_line', lineData);
  });
  // Listen for drawing events sent by the client
  socket.on('draw_line', (data) => {
    // Add line to server history
    lineHistory.push(data);
    // Send line to all connected clients
    io.emit('draw_line', data)
  });
  // Reset all lines
  socket.on('reset_lines', (data) => {
    lineHistory = [];
    // Send reset to all clients
    io.emit('reset_lines')
  });
  /////////////////////////////////////////////////////
  // Chat
  /////////////////////////////////////////////////////
  //listen on change_username
  socket.on('update_username', (data) => {
    socket.username = data.username
  })
  //listen on new_message
  socket.on('new_message', (data) => {
    //broadcast the new message
    io.sockets.emit('new_message', { message: data.message, username: socket.username, color: socket.color });
  })
  //listen on typing
  socket.on('typing', (data) => {
    socket.broadcast.emit('typing', { username: socket.username })
  })
});
// Disconnect
io.on('disconnect', (socket) => {
  socket.color = colorsActive.splice(colorsActive.indexOf(socket.color), 1);
  colorsToPick.push(socket.color);
  io.sockets.emit('users_online', { total: io.sockets.server.engine.clientsCount });
});
