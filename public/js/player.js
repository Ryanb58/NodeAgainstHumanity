//Basically global variables.
var socket = io();
var gameId = undefined;
var username = "";

//Load initial page template:

openInitialPage();

$(document).ready(function() {
    // User Interactions
    $('form').submit(function(){
        var code = $('#code').val();
        var name = $('#username').val();
        console.log(code + " " + name);
        socket.emit('add:playerToGame',code ,name);
        gameId = code;
        username = name;
        openConnectingPage();
        return false;
    });
});

//User selects a card to send.
//Manipulate things that have already been manipulated on the DOM.
$(document).on("click","#handPage #myHand li strong a", function(event){
    event.preventDefault();
    //Get the original URL.. which is actually the cards index in the array.

    var cardIndex = $(this).attr('href');

    console.log("Card " + cardIndex + " clicked!");
    //" + $(this).attr('href') + "

    socket.emit('submit:card', gameId, username, cardIndex);
});

//Link socket actions to functions.
socket.on('show:game', showGame);
socket.on('list:hand', updateCardsInHand);
socket.on('display:questionCard', showQuestionCard);


//Functions
function showGame()
{
    openGamePage();

}

function updateCardsInHand(cards)
{
    //Empty the current cards.
    $('#myHand').empty();

    for(i=0;i<cards.length;i++)
    {
        $('#myHand').append('<li class="list-group-item"><strong><a href="'+ i +'">' + cards[i].text + '</a></strong></li>');
    }
}

//If game master.. then show the question card.
function showQuestionCard(card)
{
    //Clear the hand.
    $('#myHand').empty();

    //Show the game template.
    openGamePage();

    //console.log("Card: " + card);
    //console.log("Card Text: " + card.text);
    $('#questionCard').html("<strong>" + card.text + "</strong>");
}


/*
 * Open/Close Page functions.
 */

function openInitialPage()
{
    $('#playerArea').html($('#initial-template').html());
}

function openConnectingPage()
{
    $('#playerArea').html($('#player-waiting-template').html());
}

function openGamePage()
{
    $('#playerArea').html($('#game-template').html());
}