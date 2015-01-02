//Basically global variables.
var socket = io();
var gameId = undefined;
var username = "";

$(document).ready(function() {
    // User Interactions
    $('form').submit(function(){
        var code = $('#code').val();
        var name = $('#username').val();
        console.log(code + " " + name);
        socket.emit('add:playerToGame',code ,name);
        gameId = code;
        username = name;
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
socket.on('list:hand', updateCardsInHand);

//FUnctions
function updateCardsInHand(cards)
{
    //Empty the current cards.
    $('#myHand').empty();

    for(i=0;i<cards.length;i++)
    {
        $('#myHand').append('<li class="list-group-item"><strong><a href="'+ i +'">' + cards[i].text + '</a></strong></li>');
    }
}

//Textfit Initialization:
//textFit(document.getElementById('joinGamePage'));
//textFit(document.getElementById('handPage'));
//textFit(document.getElementById('gameMasterPage'));
