const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.get('/', (req, res) => {

  io.clients((error, clients) => {
    if (error) throw error;
    res.send(clients); // => [6em3d4TJP8Et9EMNAAAA, G5p55dHhGgUnLUctAAAB]
  });
  


})

var list = [];

io.clients((error, clients) => {
    if (error) throw error;
  list.push(clients);
   
});


io.on('connection', socket => {
  //Get the chatID of the user and join in a room of the same name
  chatID = socket.handshake.query.chatID
  tokenID = socket.handshake.query.tokenID
  socket.join(chatID)

  socket.broadcast.emit('new', {
    'name': 'Chris',
    'chatID': '616514654'
  });

  //Leave the room if the user closes the socket
  socket.on('disconnect', () => {
    socket.leave(chatID)
    socket.broadcast.emit('leave', {
      'name': 'Chris',
      'chatID': '654654'
    });
  })
  
  socket.broadcast.emit('isConnected', list);
  
   

 

  //Send message to only a particular user
  socket.on('send_message', message => {
    receiverChatID = message.receiverChatID
    senderChatID = message.senderChatID
    senderNameID = message.senderNameID
    content = message.content
    iv = message.iv

    //Send message to only that particular id
    socket.in(receiverChatID).emit('receive_message', {
      'content': content,
      'senderChatID': senderChatID,
      'senderNameID': senderNameID,
      'receiverChatID': receiverChatID,
      'tokenID': tokenID,
      'iv': iv
    })
  })
});

http.listen(process.env.PORT)
