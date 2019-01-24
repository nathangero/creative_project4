const request = require('request');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');
const script = require('./script.js');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'))

/*********** variable declaration ***********/
const BLACKJACK = 21;
let games = [];
let deckId = '';
let playerHand = [];
let pPoints = 0;
let dealerHand = [];
let dPoints = 0;
let gameEnd = false;


/*********** axios functions ***********/
var draw = function(req, res) {
  let data = [];
  let didDealerHit = false;

  axios.get('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=1').then(response => {
    data = response.data;
    playerHand.push(response.data.cards[0]); // Grab only the next card and add it to the player's hand
    pPoints = script.calculate(playerHand);
    if (pPoints > BLACKJACK) { // Player busted
      gameEnd = true;
    }

  }).catch(err => {
      console.log(err);
  }).then(response => {
      if (dPoints < 17) { // Dealer Hits if below 17 points
        dealerDraw(req, res, false);
        didDealerHit = true;
      }

    }).catch(err => {
      console.log(err);
    }).then(response => {
        if (!didDealerHit) { // Prevents game from being sent twice
          sendGame(deckId, res); // Send the game after everything
        } 
      }).catch(err => {
        console.log(err);
      });
}

var dealerDraw = function(req, res, isGameOver) {
  let data = [];

  axios.get('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=2').then(response => {
    data = response.data;

    dealerHand.push(response.data.cards[0]);
    dPoints = script.calculate(dealerHand);
    if (dPoints > BLACKJACK) { // Check if the dealer has over 21 after hitting
        gameEnd = true;
    }

    if (isGameOver) { gameEnd = true; }
  }).catch(err => {
    console.log(err);
  }).then(response => {
    sendGame(deckId, res); // Send the game after the dealer draws since turn will be over
  }).catch(err => {
    console.log(err);
  })
}

var stand = function(req, res) {
  // Since dealer always goes last, the dealer must still hit if below 17.
  if (dPoints < 17) {
    dealerDraw(req,res,true);
  }
  else {
    gameEnd = true;
    sendGame(deckId, res);
  }
}

var sendGame = function(deckId, res) {
  let game = {
    deckId: deckId,
    shuffled: true, // Shuffled is always true when a game has already started
    playerHand: playerHand,
    playerPoints: pPoints,
    dealerHand: dealerHand,
    dealerPoints: dPoints,
    gameStarted: true,
    gameEnd: gameEnd,
  };
  // console.log(game);
  games[0] = game; // Only one game is played at a time
  res.send(game);
}


/*********** Send to api functions ***********/
app.get('/api/blackjack', (req, res) => {
  res.send(games);
});


/* For updating data */
app.put('/api/blackjack', (req, res) => {
  if (req.body.action === 'draw') {
    draw(req, res);
  }
  else {
    stand(req, res);
  }
  
});

/* For inserting new data */
// Called when a new game is created
app.post('/api/blackjack/', (req, res) => {
  // reset all variables upon creation of a new game
  let data = [];
  deckId = '';
  playerHand = [];
  pPoints = 0;
  dealerHand = [];
  dPoints = 0;
  drawnCards = 0;
  gameEnd = false;

  // First get a new shuffled deck of cards
  axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => {
    data = response.data;
    deckId = response.data.deck_id;
    // console.log("new deckId: ",deckId);
  }).then(response => {
      // Second get the player's starting cards
      axios.get('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=2').then(response => {
        playerHand.push(response.data.cards[0]);
        playerHand.push(response.data.cards[1]);
        pPoints = script.calculate(playerHand);

      }).catch(err => {
        console.log("ERR player's starting cards\n", err);
      }).then (response => {
        // Third get the dealer's starting cards
          axios.get('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=2').then(response => {
            dealerHand.push(response.data.cards[0]);
            dealerHand.push(response.data.cards[1]);
            dPoints = script.calculate(dealerHand);

          }).catch(err => {
              console.log("ERR dealer's starting cards ", err);
          }).then(response => {
              //Finally create a game object to send
              let game = {
                deckId: data.deck_id,
                shuffled: data.shuffled,
                playerHand: playerHand,
                playerPoints: pPoints,
                dealerHand: dealerHand,
                dealerPoints: dPoints,
                gameStarted: true,
                gameEnd: false,
              };
              // console.log(game);
              games[0] = game; // Only one game is played at a time
              res.send(game);
            });
        })
    })
});

app.listen(3000, () => console.log('Server listening on port 3000!'))