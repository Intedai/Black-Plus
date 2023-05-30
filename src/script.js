const blackEXP = 79680000; // EXP Amount needed for the black plus
let lastBlackPlusPlayer = "";
const jsConfetti = new JSConfetti();

// Minecraft possible text colors
let colors = {
   black: "#000000",
   darkGreen: "#00AA00",
   darkAqua: "#00AAAA",
   darkRed: "#AA0000",
   darkPurple: "#AA00AA",
   gold: "#FFAA00",
   gray: "#AAAAAA",
   darkGray: "#555555",
   blue: "#5555FF",
   green: "#55FF55",
   aqua: "#55FFFF",
   red: "#FF5555",
   lightPurple: "#FF55FF",
   yellow: "#FFFF55",
   white: "#FFFFFF"
};

// Level EXP progress bar
progressBar = document.getElementById('progress');

// Add event listener to user search button
document.getElementById('search-button').addEventListener('click', function () {
   let player = document.querySelector('input').value; // Get the input value

   /* Remember last black plus player because when u have a black + the exp doesn't display
      Only a congratulations message, so it won't make a request and spam the confetti 
   */
   if (player != lastBlackPlusPlayer) {
      lastPlayer = player
      
      // Get request to slothpixel for the levels
      fetch(`https://api.slothpixel.me/api/players/${player}`)
         .then(response => {
            if (!response.ok) {
               throw new Error('Network response was not ok');
            }
            return response.json();
         })
         .then(data => {
            let exp = data.exp;
            let color = getColor(data.level); // Progress bar color based on Hypixel level
            // Process your data here
            precent = (percentage(exp, blackEXP)); // for the progress display
            display = exp + "/" + blackEXP
            if (precent >= 100) {
               lastBlackPlusPlayer = player;
               precent = 100;
               
               // Change display message to congrats message
               display = "You have the black + CONGRATS!";

               // Show confetti
               jsConfetti.addConfetti();

            // Reset last black plus user when current player is not a black plus player
            } else {
               lastBlackPlusPlayer = "";
            }

            // Update website content
            progressBar.style.width = precent + "%";
            progressBar.textContent = display;
            progressBar.style.backgroundColor = color;
            progressBar.style.borderColor = darkenColor(color); // Darkens the border

         })
         .catch(error => {
            console.error("There has been a with fetching the users' Hypixel information, ERROR:", error);
         });
   }
});

/**
 * Calculates the percentage of x/y.
 * @param {number} x - The numerator.
 * @param {number} y - The denominator.
 * @returns {number} The percentage.
 */
function percentage(x, y) {
   return (100 * x) / y;
}

/**
 * Gets the best + color by checking the Hypixel Network Level
 * @param {number} level - The level value.
 * @returns {string} The color name or code.
 */
function getColor(level) {

    // Gets the highest plus for your level, determined by Hypixel
   if (level < 35) {
      return colors.red;
   } else if (level < 45) {
      return colors.gold;
   } else if (level < 55) {
      return colors.green;
   } else if (level < 65) {
      return colors.yellow;
   } else if (level < 75) {
      return colors.lightPurple;
   } else if (level < 85) {
      return colors.white;
   } else if (level < 95) {
      return colors.blue;
   } else if (level < 150) {
      return colors.darkGreen;
   } else if (level < 200) {
      return colors.darkRed;
   } else if (level < 250) {
      return colors.gray;
   } else {
      return colors.black;
   }
}

/**
 * Darkens the given hex color
 * @param {string} color - The color to darken (in hexadecimal format, with or without a leading '#').
 * @returns {string} The darkened color code.
 */
function darkenColor(color) {
    const amount = 60;
   // Remove # if present
   color = (color[0] === "#") ? color.substring(1, 7) : color;

   let r = parseInt(color.substring(0, 2), 16);
   let g = parseInt(color.substring(2, 4), 16);
   let b = parseInt(color.substring(4, 6), 16);

   // Decrease by 'amount' [0,255]
   r = Math.max(0, r - amount);
   g = Math.max(0, g - amount);
   b = Math.max(0, b - amount);

   // Pad each with leading zeros and return
   return "#" + [r, g, b].map(c => c.toString(16).padStart(2, "0")).join("");
}
