var socket = io();
var gameId = undefined;

//Called initially. Only one time... On page load.
pageLoad();

function pageLoad()
{
    //Emit the creation of the game.
    socket.emit('create:game');
}

/* Button Functions */
$(document).on("click","#startGameButton", function(event){
    event.preventDefault();

    //Tell the server to start the game.
    socket.emit('start:game', gameId);
});

//Display the updated scores.
socket.on('display:scores', function(scores){
    for(var username in scores)
    {
        console.log(username + " has a score of " + scores[username]);
    }
});

//Note that the game has been created.
socket.on('game:created', function(roomId){
    //console.log("Game ID: " + roomId);

    //gameId and roomId should be interchangeable.
    //Store gameId.
    gameId = roomId;

    //Show "player-waiting-template".
    openPlayerConnectionPage();

    $('#gameIdPage h2').text(roomId);
});

//Show the host a list of the players connected.
socket.on('list:players', function(players){
    console.log('listing players..');

    //Clear the list of users.
    $('#onlineUsers').empty();

    //Add the players to the list.
    for(i = 0; i < players.length; i++)
    {
        $('#onlineUsers').append($('<li class="list-group-item">').html("<div style=\'text-decoration: underline\'>" + players[i] + "</div>"));
    }
});

//Show the question card.
socket.on('display:questionCard', function(card)
{
    //Show the game template.
    openGamePage();

    //console.log("Card: " + card);
    //console.log("Card Text: " + card.text);
    $('#questionCard').html("<strong>" + card.text + "</strong>");
});

//Show the cards that have been submitted.
socket.on('list:submittedCards', function(cards)
{
    $('#submittedCardsPage #submittedCards').empty();

    for(i=0; i<cards.length;i++)
    {
        $('#submittedCardsPage #submittedCards').append($('<li id="list-group-item">').html(cards[i].text));
    }
});

//Let everyone know who the winner of the round!
socket.on('winning:player', function(name){
    //TODO: Make this into a like DIV popup or something.
    alert(name + ' won this round!');
});



/*
 * Open/Close Page functions.
 */

function openPlayerConnectionPage()
{
    $('#hostArea').html($('#player-waiting-template').html());
}

function openGamePage()
{
    $('#hostArea').html($('#game-template').html());
}
