var _ = require("lodash");

/*
 * Class Names are capitalized.
 * Variables are lower camel case.
 * Fuctions are lower case.
 */

/*
 * Player:
 *  -Username
 *  -socket
 */

//Constructor
function Game(socket){
    this.roomId = ( Math.random() * 100000 ) | 0;
    this.host = socket;
    this.players = {};

    //Add this socket to the correct roomId.
    this.host.join(this.roomId);
}

//Methods:

Game.prototype.addPlayer = function(username, socket)
{
    //Add user to the list of players.
    this.players[username] = socket;

    //Add them to the correct broadcast room.
    //this.players[username].join(this.roomId);
}

Game.prototype.removePlayer = function(player)
{
    delete this.players[player.username];
}

Game.prototype.getListOfPlayers = function()
{
    return this.players;
}

Game.prototype.getListOfPlayerNames = function()
{
    console.log(Object.keys(this.players));
    return Object.keys(this.players);
}


module.exports = Game;
