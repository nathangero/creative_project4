<template>
    <div id="blackjack">
        <h1>Blackjack</h1>
        <button id="about" v-on:click="displayAbout()">?</button>
        <button id="startbutton" v-on:click="start()">Start new game</button>
        <p v-if="gameStarted === true">
            <button id="playbuttons" v-on:click="drawCard">Hit</button>
            <button id="playbuttons" v-on:click="stand">Stand</button>
        </p>
        <br/> <br/>

        <div class="cardWrapper" v-if="playerHand.length > 0">
            <p>Dealer's Hole</p> 
            <p><img v-bind:src="this.dealerHand[0].image" width="80" height="110"></p>
            <p>Your Card count: {{ pPoints }} </p>
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
            about: '',
        }
    },
    methods: {
        start: function() {
            this.loading = true;

            axios.post('/api/blackjack').then(response => {
                // Set the front end variables
                this.playerHand = response.data.playerHand;
                this.pPoints = response.data.playerPoints;
                this.dealerHand = response.data.dealerHand;
                this.dPoints = response.data.dealerPoints;
                this.gameStarted = response.data.gameStarted;
                
                // Check for blackjack
                if (this.pPoints === this.BLACKJACK) {
                    alert("~~~* BLACKJACK *~~~\nYou won!");
                }

                document.getElementById("footer").style.position = 'relative';
                return true;
            }).catch(err => {
                console.log(err);
            });        
        },
        drawCard: function() {
            axios.put('/api/blackjack', {
                action: 'draw',
            }).then(response => {
                // Update the variables with the new values
                this.playerHand = response.data.playerHand;
                this.pPoints = response.data.playerPoints;
                this.dealerHand = response.data.dealerHand;
                this.dPoints = response.data.dealerPoints;
                this.gameEnd = response.data.gameEnd;

                // Always check for blackjack first
                if (this.pPoints === this.BLACKJACK) {
                    alert("~~~* BLACKJACK *~~~\nYou won!");
                    return true; // End the function right here
                }
                if (this.gameEnd) {
                    this.checkIfWon();
                }
            }).catch(err => {
                console.log(err);
            })
        },
        stand: function() {
            axios.put('/api/blackjack', {
                action: 'stand',
            }).then(response => {
                // Update the variables with the new values
                this.playerHand = response.data.playerHand;
                this.pPoints = response.data.playerPoints;
                this.dealerHand = response.data.dealerHand;
                this.dPoints = response.data.dealerPoints;
                this.gameEnd = response.data.gameEnd;

                this.checkIfWon();
            })
        },
        checkIfWon: function() {
            // If both player's and dealer's points are 21 or under
            if (this.pPoints <= this.BLACKJACK && this.dPoints <= this.BLACKJACK) {
                if (this.pPoints > this.dPoints) {
                    alert("*** YOU WON! *** \nYour points: " + this.pPoints + "\nDealer's points: " + this.dPoints);
                }
                else if (this.pPoints < this.dPoints) {
                    alert("You lost! \nYour points: " + this.pPoints + "\nDealer's points: " + this.dPoints);
                }
                else {
                    alert("Draw!");
                }
            }
            // If only the player busted
            else if (this.pPoints > this.BLACKJACK && this.dPoints <= this.BLACKJACK) {
                alert("You busted! \nTotal points: " + this.pPoints + "\nDealer's points: " + this.dPoints);
            }
            // If only the dealer busted
            else if (this.pPoints <= this.BLACKJACK && this.dPoints > this.BLACKJACK) {
                alert("*** YOU WON! *** \nThe dealer busted! \nYour points: " + this.pPoints + "\nDealer's points: " + this.dPoints);
            }
            // If both busted
            else {
                alert("Draw! You both busted! \nYour points: " + this.pPoints + "\nDealer's points: " + this.dPoints);
            } 
        },
        displayAbout: function() {
            alert("Welcome to Blackjack!\nYour goal is the beat the dealer by scoring 21 (blackjack) or under, and your points must beat those of the dealer's.\n\nRules:\n-Hitting adds 1 card to your hand.\n-Standing ends the game and both yours and the dealer's total points are compared at the end.\n\nYou'll see a pop up like this that tells you if you've won, lost, or tied.\n\nPress the 'Start new game' button to begin!");
        }
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
    margin-bottom: -1px;
    padding-bottom: 20px;
}

#about {
    position:absolute;
    top: 0;
    right: 0;
    margin-top: 12px;
    margin-right: 14px;
    border-radius: 20%;
    border: none;
    font-size: 30px;
}


#startbutton {
    width: 10;
    padding: 8px 16px;
    margin-bottom: 10px;
    border: none;
    background-color: white;
}

#startbutton:active {
    font-size: 10px;
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

#playbuttons:active {
    font-size: 12px;
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
