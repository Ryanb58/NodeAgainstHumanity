//Basically global variables.
var socket = io();
var gameId = undefined;
var username = "";

//Load initial page template:
openInitialPage();

//Add event listener on page ready up... so that on submit the form will actually do something.
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
$(document).on("click","#myHand li strong a", function(event){
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
    //Show the game template.
    openGameMasterPage();

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

function openGameMasterPage()
{
    $('#playerArea').html($('#gameMaster-template').html());
}