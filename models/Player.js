/*
 *
 * Id = Session ID of Player.
 * Name = The name, the player chooses.
 * Hand = The cards in the player's hand.
 *
 */

//Include Cards Model maybe... if so do it here.
var _ = require('lodash');

//Model of a player.
function Player(name) {
    this.username = name;
    this.hand = [];
    this.score = 0;
}

Player.prototype.getId = function()
{
    return this.id;
}

Player.prototype.getSocketId = function()
{
    return this.socketId;
}

Player.prototype.getName = function()
{
    return this.name;
}

Player.prototype.addCardToHand = function(card)
{
    this.hand.push(card);
}

Player.prototype.removeCardFromHand = function(card)
{
    //Remove from player's hand...
    _.remove(this.hand, card);
}

Player.prototype.printHand = function()
{
    _.foreach(this.hand, function(card)
    {
        console.log(card);
    });
}

Player.prototype.increaseScore = function()
{
    this.score++;
}

module.exports = Player;
