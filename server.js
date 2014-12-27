//Server
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

//Modules
var _ = require('lodash');

//Custom Modules
var Game = require('./game.js');

//Global variables.
global.__base = __dirname + '/';
var games = {};


/** Web Pages **/

//Send the client user.
app.get('/', function(req, res) {
    res.sendFile(__base + 'public/index.html');
});

//Send the client user.
app.get('/user', function(req, res) {
    res.sendFile(__base + 'public/user.html');
});

//Send the client host.
app.get('/host', function(req, res) {
    res.sendFile(__base + 'public/host.html');
});


/** Handle Sockets **/

io.on('connection', function(socket) {

    console.log("Player connected");

    socket.on('create:game', function() {
        console.log("Creating a game");

        //Create the game.
        var game = new Game(socket);

        //Store game away.
        games[game.roomId] = game;

        //Emit the game info to the client.
        socket.emit('game:created', game.roomId);
    });

    //Get list of games.
    socket.on('get:games', function(){
        socket.emit('list:games', Object.keys(games));
    });

    //Disconnect socket.
    socket.on('disconnect', function() {
        //Figure out how to check if it is a player, or a host that quits...

        //If a host disconnects then remove the game from games.
        console.log("Player disconnected");
    });

});


/** Start up server **/
http.listen(8080, function() {
    console.log('listening on *:8080');
});
