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
app.get('/player', function(req, res) {
    res.sendFile(__base + 'public/player.html');
});

//Send the client host.
app.get('/host', function(req, res) {
    res.sendFile(__base + 'public/host.html');
});


/** Handle Sockets **/

io.on('connection', function(socket) {

    console.log("Player connected");

    /* Host Functions */

    socket.on('create:game', function() {
        console.log("Creating a game");

        //Create the game.
        var game = new Game(socket);

        //Store game away.
        games[game.roomId] = game;

        //Emit the game info to the client.
        socket.emit('game:created', game.roomId);
    });

    /* Player Functions */

    socket.on('add:playerToGame', function(gameId, playerName){
        console.log('Adding a player');

        //Check to make sure game exists.
        if(!(gameId in games))
        {
            //The game ID does not exist.
            console.log("game id doesn't exist.");
        }

        //If game exits add player to the game.
        games[gameId].addPlayer(playerName, socket);

        //DEBUG HELPER:
        console.log("Games Players: ");
        var playerNames = games[gameId].getListOfPlayerNames();
        for(i=0;i<playerNames.length;i++){
            console.log(playerNames[i] + ":");
            for(j=0;j<games[gameId].hands[playerNames[i]];j++)
            {
                //var cards = ;
                console.log(games[gameId].hands[playerNames[i]]);
            }
        }

        //Tell the client that they have been added to the game.

    });

    /* Admin Functions */

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
