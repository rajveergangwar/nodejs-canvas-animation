var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var serverPlayerObj =   [];

var player = function (width,height,startX,startY) {
    this.width  = width;
    this.height = height;
    this.posX   = startX;
    this.posY   = startY;
    this.id     =   '';
}

app.get('/', function (req, res) {
    res.sendfile('index.html');
});

io.on('connection', function (socket) {
    var p1  =   new player();
    p1.width= 30;
    p1.height=30;
    p1.posX=rand(0,1);
    p1.posY=rand(100,400);
    p1.id=socket.id;
    serverPlayerObj.push(p1);
    socket.emit('new_player', serverPlayerObj);
    console.log('a user connected');
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});


function rand(min,max,interval)
{
    if (typeof(interval)==='undefined') interval = 40;
    var r = Math.floor(Math.random()*(max-min+interval)/interval);
    return r*interval+min;
}