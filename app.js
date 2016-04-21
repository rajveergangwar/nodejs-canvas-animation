var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var canvas_data = {cWidth: 640, cHeight: 480};
var SOCKET_LIST = [];
app.get('/', function (req, res) {
    res.sendfile('index.html');
});
var test    =   [];
io.on('connection', function (socket) {
    var k           =   [];
    socket.objId    = socket.id;
    socket.x        = getRandomArbitrary(0, 640);
    socket.y        = 0;
    socket.Iscolled = false;
    socket.num      = getRandomColor();
    socket.on('canvas_data', function (data) {
        canvas_data.cWidth = data.width;
        canvas_data.cHeight = data.height;
    });
    
    socket.emit("info",socket.objId);
    
    socket.on("collision_detacted", function (collied_data) {
        socket.Iscolled     =   true;
        socket.objId        =   collied_data.socketId;
    });
    SOCKET_LIST[socket.objId] = socket;

    //console.log(SOCKET_LIST);
    socket.on('disconnect', function () {
        delete SOCKET_LIST[socket.objId];
    });
});

setInterval(function () {
    var holder = [];
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
            if (socket.y != canvas_data.cHeight) {
                if (socket.Iscolled) {
                    socket.y += 10;
                    if (socket.y >= 480) {
                        socket.y = 0;
                        socket.objId    =   i;
                        socket.x = getRandomArbitrary(0, 640);
                        socket.num = getRandomColor();
                        socket.Iscolled = false;
                    }
            }
            else {
                socket.y += 1;
            }
        } else {
            socket.y        =   0;
            socket.x        =   getRandomArbitrary(0, 640);
            socket.Iscolled =   false;
            socket.num      =   getRandomColor();
            socket.objId    =   i;
        }
        holder.push({
            x: socket.x,
            y: socket.y,
            num: socket.num,
            id:i,
        });
    }
    for (var i in SOCKET_LIST) {
        var socket = SOCKET_LIST[i];
        console.log(holder);
        socket.emit('new_position', holder);
    }

}, 1000/40);

http.listen(3000, function () {
    console.log('listening on *:3000');
});

/*
 * Generating the ramdom number beween the range
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

/*
 * ge random color
 */



function getRandomColor() {
    var letters = '0123456789ABCDEF'.split('');
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}