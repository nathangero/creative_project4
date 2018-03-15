const request = require('request');
const axios = require('axios');
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('dist'))

let games = [];
let deckId = '';

var convertToPoints = function(code) {
  switch (code.charAt(0)) {
    case "A":
      return 1; // Always return 1 for Aces here. Can convert to 11 elsewhere
    case "2":
      return 2;
    case "3":
      return 3; 
    case "4":
      return 4;
    case "5":
      return 5; 
    case "6":
      return 6;
    case "7":
      return 7;               
    case "8":
      return 8;
    case "9":
      return 9; 
    default:
      return 10;
  }
}

var calculate = function(cards) {
  let sum = 0;
  let hasAce = false;
  for (var i = 0; i < cards.length; i++) {
    // console.log("code: " + cards[i].code);
    if (cards[i].code.charAt(0) === "A") { hasAce = true; }
    sum += convertToPoints(cards[i].code);
  }

  // This should also work for if there's more than one ace.
  // Since two aces could be 22, one MUST be 1 and the other 11.
  // Therefore, this condition should work. 
  if (hasAce) {
    //   console.log("calcuating ace");
      let psuedoSum = (sum + 10); // Add 10 to make the Ace "equal" 11
      if (psuedoSum <= 21) { // If the Ace being 11 keeps the player 21 and under,
          sum = psuedoSum; // This is the new point value
      }
  }
//   console.log("sum: " + sum);
  return sum;
}

app.get('/api/blackjack', (req, res) => {
  res.send(games);
});

/* For inserting new data */
app.post('/api/blackjack/', (req, res) => {
  console.log("@.post");
  let data = [];
  let hand = [];
  let pPoints = 0;
  let dealer = [];
  let dPoints = 0;

  // First get a new shuffled deck of cards
  axios.get('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => {
    data = response.data;
    deckId = response.data.deck_id;
    console.log("deckId: ",deckId);
  }).then(response => {
      // Second get the player's starting cards    
      axios.get('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=2').then(response => {
        hand.push(response.data.cards[0]);
        hand.push(response.data.cards[1]);
        pPoints = calculate(hand);
      }).catch(err => {
        console.log("ERR player's starting cards\n", err);
      }).then (response => {
        // Third get the dealer's starting cards
          axios.get('https://deckofcardsapi.com/api/deck/' + deckId + '/draw/?count=2').then(response => {
            dealer.push(response.data.cards[0]);
            dealer.push(response.data.cards[1]);
            dPoints = calculate(dealer);
          }).catch(err => {
              console.log("ERR dealer's starting cards ", err);
          }).then(response => {
              //Finally create a game object to send
              let game = {
                deckId: data.deck_id,
                shuffled: data.shuffled,
                remaining: 48,
                playerHand: hand,
                playerPoints: pPoints,
                dealerHand: dealer,
                dealerPoints: dPoints,
              };
              // console.log(game);
              games[0] = game; // Only one game is played at a time
              res.send(game);
            });
        })
    })
});

/* For updating data */
app.put('/api/blackjack/:deckId', (req, res) => {
  console.log("@.put");
  // let id = parseInt(req.params.id);
  // let itemsMap = items.map(item => { return item.id; });
  // let index = itemsMap.indexOf(id);
  // let item = items[index];
  // item.text = req.body.text;

  // res.send(item);
});


app.delete('/api/blackjack/:deckId', (req, res) => {
  console.log("@.delete");

  // let id = parseInt(req.params.id);
  // let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  // if (removeIndex === -1) {
  //   res.status(404).send("Sorry, that item doesn't exist");
  //   return;
  // }
  // items.splice(removeIndex, 1);
  // res.sendStatus(200);
});

app.listen(3000, () => console.log('Server listening on port 3000!'))