/*
*
* Text = the cards text.
*
*/

//Model of a card.
function Card(text) {
	this.text = text;
}

/**** METHODS ****/

Card.prototype.getText = function getText()
{
	return this.text;
}

module.exports = Card;
