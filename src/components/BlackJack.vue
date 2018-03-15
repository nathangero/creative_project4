<template>
    <div id="blackjack">
        <h1>Welcome to blackjack</h1>
        <button v-on:click="start($event)">Start new game</button>
        <p v-if="gameStarted === true">
            <button id="playbuttons" v-on:click="drawCard">Hit</button>
            <button id="playbuttons" v-on:click="stand">Stand</button>
        </p>
        <br/> <br/>

        <div class="cardWrapper" v-if="hand.length > 0">
            <p>Dealer's Hole</p> 
            <p><img v-bind:src="this.dealerHand[0].image" width="80" height="110"></p>
            <p>Your Card count: {{ points }} </p>
            <p id="hand" v-for="card in hand">
                <img v-bind:src="card.image" v-bind:alt="card.alt"> 
            </p>
        </div>

        <footer id="footer">
            <a id="github" target="_blank" href="https://github.com/nathangero/creative_project3">Github Classroom</a>
        </footer>
    </div>
</template>

<script>

export default {
  data() {
      return {
        BLACKJACK: 21,
        gameStarted: false,
        loading: true,
        data: {},
        deckID: 0,
        shuffled: false,
        remaining: 0,
        hand: [],
        points: 0,
        dealerHand: [], // need to keep track of the dealer's cards
        dealerPoints: 0,
        gameEnd: false,
      }
  },
  methods: {
      start: function(event) {
        this.loading = true;
        fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1').then(response => {
            console.log("\nNEW GAME START!");
            return response.json();
        }).then(json => {
            this.data = json;
            this.gameStarted = true;
            this.deckID = json.deck_id;
            this.shuffled = json.shuffled;
            this.remaining = json.remaining;
            this.hand = new Array(); // Reinitialize the array when a new game is started
            this.dealerHand = new Array();
            this.gameEnd = false;
            // console.log("deckid: " + this.deckID);
            // console.log("shuffled: " + this.shuffled);
            // console.log("remaining: " + this.remaining);
            
            /* Grab the first two cards to start the game */
            fetch('https://deckofcardsapi.com/api/deck/' + this.deckID + '/draw/?count=2').then(response => {
                return response.json();
            }).then(json => {
                // console.log("first two cards drawn");
                // console.log("card 1: " + json.cards[0].code);
                // console.log("card 2: " + json.cards[1].code);
                
                // Adds cards to the player's hand
                this.hand.push(json.cards[0]);
                this.hand.push(json.cards[1]);
                this.points = this.calculate(this.hand);
                if (this.points === this.BLACKJACK) {
                    this.gameEnd = true;
                    alert("*** BLACKJACK! YOU WON! ***");
                }

                // Now grab two for the dealer
                fetch('https://deckofcardsapi.com/api/deck/' + this.deckID + '/draw/?count=2').then(response => {
                    return response.json();
                }).then(json => {

                    // Adds cards to the dealer's hand
                    this.dealerHand.push(json.cards[0]);
                    this.dealerHand.push(json.cards[1]);
                    this.dealerPoints = this.calculate(this.dealerHand);

                    this.gameStarted = true; // Makes the buttons appear
                    document.getElementById("footer").style.position = 'relative';

                    // console.log("dealer's starting cards: " + this.dealerHand[0].code + " " + this.dealerHand[1].code);
                    // console.log("Dealer's points at start: " + this.dealerPoints);
                });
            });
        })          
      },
      drawCard: function() {
        fetch('https://deckofcardsapi.com/api/deck/' + this.deckID + '/draw/?count=1').then(response => {
            return response.json();
        }).then (json => {
            // console.log("player draws");

            this.hand.push(json.cards[0]);
            this.points =  this.calculate(this.hand);
            // console.log(this.points);

            // Check if player busts and game isn't over
            if (this.points === this.BLACKJACK) {
                this.stand(); // End the game right away
            }
            if (this.points > this.BLACKJACK && !this.gameEnd) { 
                alert("You busted! \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
                this.gameEnd = true;
            }
            else if (this.dealerPoints < 17) { // Dealer must hit if below 17
                this.dealerDraw();
            }
            // Check if both have 21 points
            if (this.points === this.BLACKJACK && this.dealerPoints === this.BLACKJACK) {
                alert("Draw!");
                this.gameEnd = true;
            }
        })
      },
      dealerDraw: function() {
          fetch('https://deckofcardsapi.com/api/deck/' + this.deckID + '/draw/?count=1').then(response => {
            return response.json();
        }).then (json => {
            // console.log("Dealer draws");
            // console.log("pre draw dealer points: " + this.dealerPoints);

            // Check Dealer's points
            this.dealerHand.push(json.cards[0]);
            this.dealerPoints = this.calculate(this.dealerHand);
            // console.log("new points: " + this.dealerPoints);
            // console.log("dealer hand: ");
            // for (var i = 0; i < this.dealerHand.length; i++) {
            //     console.log(this.dealerHand[i].code);
            // }


            if (this.dealerPoints > this.BLACKJACK) { // Check if the dealer has over 21 after hitting
                alert("*** YOU WON! ***\nThe dealer busted! Total points: " + this.points + "\nDealer's points: " + this.dealerPoints);
                this.gameEnd = true;
                return; // End the function
            }

            if (this.gameEnd) {
                if (this.points > this.dealerPoints) {
                    alert("*** YOU WON! *** \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
                }
                else if (this.points === this.dealerPoints) {
                    alert("Draw!");
                }
                else {
                    alert("You lost! \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
                }
            }
        })
      },
      stand: function() {
        // console.log("USER STANDS");

        if (!this.gameEnd) {
            // Since dealer always goes last, the dealer must still hit if below 17.
            if (this.dealerPoints < 17) {
                this.dealerDraw();
            }
            
            if (this.points > this.dealerPoints && this.dealerPoints >= 17) {
                alert("*** YOU WON! *** \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
            }
            else if (this.points < this.dealerPoints && this.dealerPoints >= 17){
                alert("You lost! \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
            }
            else if (this.points === this.dealerPoints) {
                alert("Draw!");
            }

        }

        this.gameEnd = true;

      },
      calculate: function(cards) {
        //   console.log("@calculate");
          let sum = 0;
          let hasAce = false;
          for (var i = 0; i < cards.length; i++) {
            // console.log("code: " + cards[i].code);
            if (cards[i].code.charAt(0) === "A") { hasAce = true; }
            sum += this.convertToPoints(cards[i].code);
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
      },
      convertToPoints(code) {
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
      },
  }
}
</script>

<style scoped>
#blackjack {
    background-color: #277714;
    margin-top: -53px;
    padding-top: 30px;
    color: white;
}

h1 {
    font-weight: normal;
    text-decoration: none;
    margin-top: -7px;
    padding-bottom: 20px;
}

#playbuttons {
    width: 10;
    padding: 8px 16px;
    border-radius: 3px;
    font-size: 16px;
    background-color: rgb(78, 165, 252);
    border: none;
    color: white;
    margin-left: 10px;
    margin-right: 10px;
    margin-bottom: -50px;
}


.cardWrapper {
    background-color: #277714;
    width: 100%;
}

#hand {
    display: inline-block;    
    margin-bottom: 60px;
}

footer {
    /* Puts the footer bar at the bottom of the page*/
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;
    clear: both;

    background-color: #d4d4d4;
    padding: 15px;
    text-align: center;
    color: rgba(255, 255, 255, 0.911)!important;
    font-family: Verdana;
}
</style>
