var _ = require("lodash");

/*
 * Class Names are capitalized.
 * Variables are lower camel case.
 * Fuctions are lower case.
 */

/*
 * Players:
 *  -Key:Username
 *  -Value:socket<Object>
 *
 * Hands:
 *  -Key:Username
 *  -Value:cards<Array>.
 *
 * Scores:
 *  -Key:Username
 *  -Value:score<Int>
 *
 */

//Constructor
function Game(socket){

    //Populate deck instances of cards.
    //Filter for only the Base deck of cards.
    this.answerDeck = _.filter(require('cah-cards/answers'), { 'expansion': 'Base' });
    this.questionDeck = _.filter(require('cah-cards/pick1'), { 'expansion': 'Base' });

    //Game Properties
    this.roomId = ( Math.random() * 100000 ) | 0;
    this.host = socket;
    this.players = {};
    this.hands = {};
    this.scores = {};
    this.submittedCards = new Array();
    
    //Username of the current game master.
    this.gameMaster = "";
    
    this.questionCard = new Object();
    this.setNewQuestionCard();

    //Add this socket to the correct roomId.
    this.host.join(this.roomId);
}

/*** Player Methods ***/

Game.prototype.addPlayer = function(username, socket)
{
    //Make the first person added to the game the initial gameMaster.
    if(this.gameMaster == "")
    {
        this.gameMaster = username;
    }

    //Add user to the list of players.
    this.players[username] = socket;

    //Create their initial Hand.
    this.refillPlayersHand(username);

    //Initialize their score to 0.

    //Add them to the correct broadcast room.
    this.players[username].join(this.roomId);
}

Game.prototype.selectNewGameMaster = function()
{
    var listOfPlayers = this.getListOfPlayerNames();
    var playerNumber = listOfPlayers.indexOf(this.gameMaster);
    var oldGameMaster = this.gameMaster;

    //Runs until it selects a Game Master that wasnt the same as the previous.
    while(this.gameMaster == oldGameMaster)
    {
        //max(exclusive) min(inclusive) --> Math.floor(Math.random() * (max - min) + min);
        playerNumber = Math.floor(Math.random() * listOfPlayers.length);
        this.gameMaster = listOfPlayers[playerNumber];
    }
    console.log("New GameMaster: " + listOfPlayers[playerNumber]);
}

Game.prototype.getGameMaster = function()
{
    return this.players[this.gameMaster];
}

Game.prototype.getPlayer = function(username)
{
    return this.players[username];
}

Game.prototype.removePlayer = function(username)
{
    delete this.players[username];
    delete this.hands[username];
    delete this.scores[username];
}

Game.prototype.getListOfPlayers = function()
{
    return this.players;
}

Game.prototype.getListOfPlayerNames = function()
{
    //console.log(Object.keys(this.players));
    return Object.keys(this.players);
}

Game.prototype.getGameMasterName = function()
{
    return this.gameMaster;
}

Game.prototype.getHostSocket = function()
{
    return this.host;
}

Game.prototype.getPlayerCount = function()
{
    return Object.keys(this.players).length;
}


/* Card Methods */
/*
    TODO:
        Look into making sure no redundant cards are picked... (setting the picked cards to undefined in the deck maybe?)
*/

Game.prototype.removeCardFromHand = function(playerName, cardIndex)
{
    this.hands[playerName].splice(cardIndex, 1);
}

Game.prototype.renewQuestionCard = function()
{
    var newQCard = this.getRandomCardFromQuestionDeck();
    this.questionCard = newQCard;
}

Game.prototype.getQuestionCard = function(card)
{
    return this.questionCard;
}

Game.prototype.getSubmittedCards = function()
{
    //Return a list of submitted cards.
    return this.submittedCards;
}

Game.prototype.addSubmittedCard = function(card)
{
    this.submittedCards.push(card);
}

Game.prototype.clearSubmittedCards = function()
{
    //Source: http://stackoverflow.com/questions/1232040/empty-an-array-in-javascript
    while(this.submittedCards.length > 0) {
        this.submittedCards.pop();
    }
}

Game.prototype.getSubmittedCardsCount = function()
{
    return this.submittedCards.length;
}

Game.prototype.setNewQuestionCard = function()
{
    //console.log("getting random card");
    //console.log(_.size(this.answerDeck));
    var Card;

    keepGoing = true;

    while(keepGoing)
    {
        //Pick random number within the bounds of the deck.
        var CardNumber = Math.floor(Math.random() * _.size(this.answerDeck));
        //Get a copy of that card.
        Card = this.questionDeck[CardNumber];

        //Set the questionCard.
        this.questionCard = Card;

        //Ensure the card picked is not undefined.
        if(!_.isUndefined(Card))
        {
            keepGoing = false;
            return Card;
        }
        //Else retry...
    }
}

Game.prototype.getRandomCardFromAnswerDeck = function()
{
    //console.log("getting random card");
    //console.log(_.size(this.answerDeck));
    var Card;

    keepGoing = true;

    while(keepGoing)
    {
        //Pick random number within the bounds of the deck.
        var CardNumber = Math.floor(Math.random() * _.size(this.answerDeck));
        
        //Get a copy of that card.
        Card = this.answerDeck[CardNumber];

        
        //Ensure the card picked is not undefined.
        if(!_.isUndefined(Card))
        {
            keepGoing = false;
            return Card;
        }
        //Else retry...
    }
}

Game.prototype.refillAllPlayersHands = function()
{
    for(i=0;i<this.getPlayerCount();i++)
    {
        this.refillPlayersHand(this.getListOfPlayerNames()[i]);
    }
}

//Ensure the player has at least 7 cards in their hands.
Game.prototype.refillPlayersHand = function(username)
{
    //Make sure the slot isn't undefined.
    if(this.hands[username] == undefined)
    {
        this.hands[username] = new Array();
        //console.error("Undefined hands...Initializing to new array.");
    }

    //If the user doesn't have at least 7 cards then get them from the deck.
    for(j = _.size(this.hands[username]); j < 7; j++)
    {
        //console.log("Adding card to the hand..");
        this.hands[username].push(this.getRandomCardFromAnswerDeck());
    }

    //console.log(this.hands[username]);
}

//Return the cards the user has in their hand.
Game.prototype.getPlayersHand = function(username)
{
    return this.hands[username];
}



/*** Score Methods ***/

Game.prototype.getPlayerScore = function(username)
{
    return this.scores[username];
}

Game.prototype.getAllScores = function()
{
    return this.scores;
}

Game.prototype.addPointToPlayer = function(username)
{
    //If not initialized.. then do so to 0;
    if(this.scores[username] == undefined)
    {
        this.scores[username] = 0;
    }

    this.scores[username] = this.scores[username] + 1;
}


//Boiler plate.
module.exports = Game;
