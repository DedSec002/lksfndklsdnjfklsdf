const app = require('express')()
const http = require('http').createServer(app)
const io = require('socket.io')(http);

app.get('/', (req, res) => {
    res.send("Node Server is running. Yay!!")
})

io.on('connection', socket => {
    //Get the chatID of the user and join in a room of the same name
    chatID = socket.handshake.query.chatID
    tokenID = socket.handshake.query.tokenID
    socket.join(chatID)

    //Leave the room if the user closes the socket
    socket.on('disconnect', () => {
        socket.leave(chatID)
    })

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
            'iv': tokenID
        })
    })
});

http.listen(process.env.PORT)
