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

//Send the client user.
});
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

        //console.log("Question Card: " + game.getQuestionCard().text);

        //DEBUG: Show Current Question Card.
        socket.emit('display:questionCard', game.getQuestionCard());
    });

    /* Player Functions */
    //Probably have to submit the gameID of which you are in every request...

    socket.on('add:playerToGame', function(gameId, playerName){
        console.log('Adding a player');

        //Check to make sure game exists.
        if(!(gameId in games))
        {
            //The game ID does not exist.
            console.log("game id doesn't exist.");
            return;
        }

        //If game exits add player to the game.
        games[gameId].addPlayer(playerName, socket);

        //DEBUG HELPER:
        console.log("Games Players: ");
        var playerNames = games[gameId].getListOfPlayerNames();
        for(i=0;i<playerNames.length;i++){
            console.log(playerNames[i] + ":");
            console.log(games[gameId].getPlayersHand(playerNames[i]));
        }

        //Tell the client that they have been added to the game.
        var host = games[gameId].getHostSocket();
        host.emit('list:players', playerNames);

        //Send them their hand of cards.
        socket.emit('list:hand', games[gameId].getPlayersHand(playerName));

    });

    socket.on('submit:card', function(gameId, playerName, cardIndex)
    {
        //If player is the game master.. then the card, is the card of the winner.
        if(playerName == games[gameId].getGameMasterName())
        {
            //Then add point to the person whom submitted that card here..
            var winnerName = games[gameId].getSubmittedCards()[cardIndex].playername;
            games[gameId].addPointToPlayer(winnerName);

            //Tell the host whom won the round!
            games[gameId].getHostSocket().emit('winning:player', winnerName);

            //then reset for new round.(make sure all hands are filled.)
            games[gameId].refillAllPlayersHands();

            //select a new question card.
            games[gameId].setNewQuestionCard();

            //select a new game master.
            games[gameId].selectNewGameMaster();

            //emit all the stuff to the clients.

            return;
        }

        //Get the card from the players hand.
        var card = games[gameId].getPlayersHand(playerName)[cardIndex];
        //console.log(card);

        //Check and make sure they haven't already submitted a card.
        if(games[gameId].getPlayersHand(playerName).length !== 7)
        {
            //Already submitted a card...
            console.log(playerName + " has already submitted a card.");
            return;
        }

        //Add user's name to the submitted card. (Helps keep track of whom submitted what..)
        card.playername = playerName;

        //Put card in submitted cards pile.
        games[gameId].addSubmittedCard(card);

        //Remove card from players hand.
        games[gameId].removeCardFromHand(playerName, cardIndex);

        //Send them the updated hand of cards.
        socket.emit('list:hand', games[gameId].getPlayersHand(playerName));

        //DEBUG: Tell the host to update the list of submitted cards.
        games[gameId].getHostSocket().emit('list:submittedCards', games[gameId].getSubmittedCards());

        ////Check if they are the last person to submit their card.
        var submittedCount = games[gameId].getSubmittedCardsCount();
        //Player count minux the gamemaster.
        var playerCount = games[gameId].getPlayerCount() - 1;
        console.log(submittedCount + " : " + playerCount);
        if(submittedCount == playerCount)
        {
            console.log("All players have submitted their cards...showing submitted cards to game master.")
            //Appears that they are the last person to submit a card..
            //Show the cards to the game master.
            var gameMaster = games[gameId].getGameMaster();
            //console.log(gameMaster.id);
            gameMaster.emit('list:hand',games[gameId].getSubmittedCards());
        }
    });

    /* Admin Functions */

    //Get list of games.
    socket.on('get:games', function(){
        socket.emit('list:games', Object.keys(games));
    });

    //Disconnect socket.
    socket.on('disconnect', function() {
        //Figure out how to check if it is a player, or a host that quits...
        for(i=0;i<games.length;i++)
        {
            if(socket.id = games[i].host.id)
            {
                //Yes it was the host that disconnected...
                //Delete their game and all the info in it.
                delete games[i];
            }
        }

        //Figure out how to know which player disconnected... from which game..
        //then tell that game's host it was removed..

        //If a host disconnects then remove the game from games.
        console.log("Player disconnected");
    });

});


/** Start up server **/
http.listen(8080, function() {
    console.log('listening on *:8080');
});
