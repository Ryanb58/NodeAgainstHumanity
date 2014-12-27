cah-cards
=========

CAH cards in JSON format

## Usage

Get all the cards

```js
var cards = require('cah-cards');
```

Get just the answers

```js
var answers = require('cah-cards/answers');
```

Get just the questions

```js
var questions = require('cah-cards/questions');
```

Get just questions that require 1 answer

```js
var pick1 = require('cah-cards/pick1');
```

Get just questions that require 2 answers

```js
var pick2 = require('cah-cards/pick2');
```

Get just questions that require 3 answers

```js
var pick3 = require('cah-cards/pick3');
```

## License

[Cards Against Humanity](http://cardsagainsthumanity.com/), trademark of Cards Against Humanity LLC, is licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 2.0 Generic License](http://creativecommons.org/licenses/by-nc-sa/2.0/)

The `cards.json`, `questions.json` and `answers.json` files produced by this script are fetched from [Hangouts against Humanity](https://github.com/samurailink3/hangouts-against-humanity) and are licensed under the [Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License](http://creativecommons.org/licenses/by-nc-sa/3.0/deed.en_US)

Code written by me (`gulpfile.js`, `package.json`, etc) are licensed under the [MIT License](https://github.com/phated/cah-cards/blob/master/LICENSE)
