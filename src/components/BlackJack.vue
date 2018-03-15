<template>
    <div id="blackjack">
        <h1>Welcome to blackjack</h1>
        <button v-on:click="start($event)">Start new game</button>
        <p v-if="gameStarted === true">
            <button id="playbuttons" v-on:click="drawCard">Hit</button>
            <button id="playbuttons" v-on:click="stand">Stand</button>
        </p>
        <br/> <br/>

        <div class="cardWrapper" v-if="playerHand.length > 0">
            <p>Dealer's Hole</p> 
            <p><img v-bind:src="this.dealerHand[0].image" width="80" height="110"></p>
            <p>Your Card count: {{ points }} </p>
            <p id="hand" v-for="card in playerHand">
                <img v-bind:src="card.image" v-bind:alt="card.alt"> 
            </p>
        </div>

        <footer id="footer">
            <a id="github" target="_blank" href="https://github.com/nathangero/creative_project4">Github Classroom</a>
        </footer>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    name: 'Blackjack',
    data() {
        return {
            BLACKJACK: 21,
            gameStarted: false,
            loading: true,
            playerHand: [],
            pPoints: 0,
            dealerHand: [], // need to keep track of the dealer's cards
            dPoints: 0,
            gameEnd: false,
        }
    },
    methods: {
        start: function(event) {
            console.log("start button hit")
            this.loading = true;

            axios.post('/api/blackjack').then(response => {
                console.log('response', response.data);
                console.log('deckId:', response.data.deckId);

                // Check for blackjack
                return true;
            }).catch(err => {
                console.log(err);
            });        
        },
        drawCard: function() {
            // fetch('https://deckofcardsapi.com/api/deck/' + this.deckID + '/draw/?count=1').then(response => {
            //     return response.json();
            // }).then (json => {
            //     // console.log("player draws");

            //     this.hand.push(json.cards[0]);
            //     this.points =  this.calculate(this.hand);
            //     // console.log(this.points);

            //     // Check if player busts and game isn't over
            //     if (this.points === this.BLACKJACK) {
            //         this.stand(); // End the game right away
            //     }
            //     if (this.points > this.BLACKJACK && !this.gameEnd) { 
            //         alert("You busted! \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
            //         this.gameEnd = true;
            //     }
            //     else if (this.dealerPoints < 17) { // Dealer must hit if below 17
            //         this.dealerDraw();
            //     }
            //     // Check if both have 21 points
            //     if (this.points === this.BLACKJACK && this.dealerPoints === this.BLACKJACK) {
            //         alert("Draw!");
            //         this.gameEnd = true;
            //     }
            // })
        },
        dealerDraw: function() {
            // fetch('https://deckofcardsapi.com/api/deck/' + this.deckID + '/draw/?count=1').then(response => {
            //     return response.json();
            // }).then (json => {
            //     // console.log("Dealer draws");
            //     // console.log("pre draw dealer points: " + this.dealerPoints);

            //     // Check Dealer's points
            //     this.dealerHand.push(json.cards[0]);
            //     this.dealerPoints = this.calculate(this.dealerHand);
            //     // console.log("new points: " + this.dealerPoints);
            //     // console.log("dealer hand: ");
            //     // for (var i = 0; i < this.dealerHand.length; i++) {
            //     //     console.log(this.dealerHand[i].code);
            //     // }


            //     if (this.dealerPoints > this.BLACKJACK) { // Check if the dealer has over 21 after hitting
            //         alert("*** YOU WON! ***\nThe dealer busted! Total points: " + this.points + "\nDealer's points: " + this.dealerPoints);
            //         this.gameEnd = true;
            //         return; // End the function
            //     }

            //     if (this.gameEnd) {
            //         if (this.points > this.dealerPoints) {
            //             alert("*** YOU WON! *** \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
            //         }
            //         else if (this.points === this.dealerPoints) {
            //             alert("Draw!");
            //         }
            //         else {
            //             alert("You lost! \nTotal points: " + this.points + "\nDealer's points: " + this.dealerPoints);
            //         }
            //     }
            // })
        },
        stand: function() {
            // console.log("USER STANDS");

            if (!this.gameEnd) {
                // Since dealer always goes last, the dealer must still hit if below 17.
                if (this.dealerPoints < 17) {
                    this.dealerDraw();
                }
                
                if (this.pPoints > this.dPoints && this.dPoints >= 17) {
                    alert("*** YOU WON! *** \nTotal points: " + this.pPoints + "\nDealer's points: " + this.dPoints);
                }
                else if (this.pPoints < this.dPoints && this.dPoints >= 17){
                    alert("You lost! \nTotal points: " + this.pPoints + "\nDealer's points: " + this.dPoints);
                }
                else if (this.pPoints === this.dPoints) {
                    alert("Draw!");
                }

            }

            this.gameEnd = true;

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
