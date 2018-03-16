module.exports = {
    convertToPoints: function(code) {
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
    calculate: function(cards) {
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
      
};

