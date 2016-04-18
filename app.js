var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var canvas_data =   {cWidth:640,cheight:480};
var SOCKET_LIST =   [];
app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.on('connection', function (socket) {
    socket.on('canvas_data',function(data){
        canvas_data.cWidth      =   data.cWidth;
        canvas_data.cHeight     =   data.cheight;
    });
    socket.id   =   Math.random();
    socket.x    =  getRandomArbitrary(0,640);
    console.log(socket.x);
    socket.y    =   0;
    socket.num  =   Math.floor((Math.random()*9) + 1);
    SOCKET_LIST[socket.id]  =   socket;
    
    
    socket.on('disconnect',function(){
       delete SOCKET_LIST[socket.id]; 
    });
});

setInterval(function(){
    var holder  =   [];
    for(var i in SOCKET_LIST) {
        var socket  =   SOCKET_LIST[i];
        if(socket.y!=canvas_data.height)
            socket.y++;
        else
            socket.y    = 0;
        
        holder.push({
            x:socket.x,
            y:socket.y,
            num:socket.num,
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

function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}