var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var SOCKET_LIST =   [];
app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.on('connection', function (socket) {
    socket.id   =   Math.random();
    socket.x    =   0;
    socket.y    =   0;
    SOCKET_LIST[socket.id]  =   socket;
});

setInterval(function(){
    var holder  =   [];
    for(var i in SOCKET_LIST) {
        var socket  =   SOCKET_LIST[i];
        socket.x++;
        if(socket.y!=480)
            socket.y++;
        else
            socket.y    = 0;
        
        holder.push({
            x:socket.x,
            y:socket.y,
        });
    }
    
    for(var i in SOCKET_LIST){
        var socket  =   SOCKET_LIST[i];
        socket.emit('new_position',holder);
    }
    
},1000/25);

http.listen(3000, function () {
    console.log('listening on *:3000');
});