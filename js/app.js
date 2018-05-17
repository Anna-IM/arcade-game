// Enemies the player must avoid
var Enemy = function(x, y) {
  // Variables applied to each of the instances go here

  // The image/sprite for the enemies, this uses
  // a helper to easily load images

  this.sprite = 'images/enemy-bug.png';
  this.x = x;
  this.y = 150;
  this.random = Math.floor(Math.random() * 3) + 1;
};

//place the Enemy randomly on the three lines
let randomArray = [50, 150, 250];

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
  // Multiply any movement by the dt parameter
  // which will ensure the game runs at the same speed for
  // all computers.
  this.x = Math.round(this.x + (this.random + 1 * dt));
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
  let num = getRandomInt(0, 2);
  if (this.x > 600) {
    this.x = 0;
    this.random = Math.floor(Math.random() * 3) + 1;
    this.y = randomArray[num];

  }
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Player class
// This class requires an update(), render() and
// a handleInput() method.
class Player {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.dy = 0;
    this.dx = 0;
    this.sprite = 'images/char-boy.png';
    this.upPressed = false;
    this.downPressed = false;
    this.leftPressed = false;
    this.rightPressed = false;
    this.live = 5;
    this.star = 0;
    this.changeable = true;
    this.isAllowedToMove = true;
    this.newPos = function() {
      this.x += this.dx;
      this.y += this.dy;
    }
  }

  //Moves of the player
  update() {
    if (this.upPressed == true && this.y > 30) {
      this.y -= 80;
      this.upPressed = false;
    } else if (this.rightPressed == true && this.x < 400) {
      this.x += 100;
      this.rightPressed = false;
    } else if (this.downPressed == true && this.y < 380) {
      this.y += 80;
      this.downPressed = false;
    } else if (this.leftPressed == true && this.x > 0) {
      this.x -= 100;
      this.leftPressed = false;
    } else {
      this.upPressed = false;
      this.rightPressed = false;
      this.downPressed = false;
      this.leftPressed = false;
    }
    this.collisonDetection();
  }
  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  handleInput(e) {
    for (let i = 0; i < allRocks.length; i++) {
      if (player.x > allRocks[i].x - 40 && player.x < allRocks[i].x + 40 &&
        player.y > allRocks[i].y - 40 && player.y < allRocks[i].y + 40) {
        alert("You can't pass, try another way!");
        //modal.style.display = "block";
        //document.getElementById('modalText').innerHTML = "You can't pass, try another way!\n \n";
        setTimeout(function() {
          player.x = 200;
          player.y = 380;
        }, 100);
      }
    }

    //Event listener for the moves of the player when the key is pressed
    document.addEventListener('keydown', function(e) {
      if (e.keyCode == 37) {
        player.leftPressed = true;
        //alert('Left was pressed');
      } else if (e.keyCode == 39) {
        player.rightPressed = true;
        //alert('Right was pressed');
      } else if (e.keyCode == 40) {
        player.downPressed = true;
        //alert('Down was pressed');
      } else if (e.keyCode == 38) {
        player.upPressed = true;
        //alert('Up was pressed');
      }
    });
  }


  collisonDetection() {
    // Get the modal
    let modal = document.getElementById('myModal');

    // Get the button that opens the modal
    let btn = document.getElementById("myBtn");

    // Get the <span> element that closes the modal
    let close = document.getElementsByClassName("close")[0];

    //Get the restart button
    let restartBtn = document.getElementById("restartButton");

    // When the user clicks on <span> (x), close the modal
    // close.onclick = function() {
    //   modal.style.display = "none";
    // }

    // When clicked the restart button restart game
    restartBtn.onclick = function() {
      location.reload();
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
      if (event.target == modal) {
        modal.style.display = "none";
      }
    }


    //Count of the star's bonus
    //Conditions when game finishes for the player
    function starCount() {
      if (player.changeable === true) {
        player.star++;
        document.getElementById('score').innerHTML = player.star;
        player.changeable = false;
      }
    }
    for (let i = 0; i < 3; i++) {
      if (this.x > allEnemies[i].x - 40 && this.x < allEnemies[i].x + 40 &&
        this.y > allEnemies[i].y - 40 && this.y < allEnemies[i].y + 40) {
        this.x = 200;
        this.y = 380;
        this.live--;
        document.getElementById('lives').innerHTML = player.live;
        if (this.live === 0) {
          modal.style.display = "block";
          document.getElementById('modalText').innerHTML = "Game over, sorry!\n \n" + "       ";
        }
      }
    }

    for (let i = 0; i < allBonuses.length; i++) {
      if (allBonuses[i] != null) {
        if (this.x > allBonuses[i].x - 40 && this.x < allBonuses[i].x + 40 &&
          this.y > allBonuses[i].y - 40 && this.y < allBonuses[i].y + 40) {

          setTimeout(function() {
            player.x = 200;
            player.y = 380;
            delete allBonuses[i];
            starCount();

            setTimeout(function() {
              player.changeable = true;
              if (player.star === 5) {
                player.star++;
                modal.style.display = "block";
                document.getElementById('modalText').innerHTML = "You won! Congrats!\n \n" + "       ";
                $("#modalText").append('<i class="fa fa-trophy"></i>');
              }
            }, 150);
          }, 100);

        }
      }
    }
  }

}

// Instantiate objects.
// All enemy objects in an array called allEnemies
const allEnemies = [new Enemy(0, 50), new Enemy(0, 100), new Enemy(0, 250)];

//Star as a bonus in the game
var Bonus = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Star.png';
}

Bonus.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

//Rock obstacle for the player
Bonus.prototype.update = function(dt) {};

var Rock = function(x, y) {
  this.x = x;
  this.y = y;
  this.sprite = 'images/Rock.png';

}

Rock.prototype.render = function() {
  ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

Rock.prototype.update = function(dt) {};

//All rocks objects in array
const myRocks = [new Rock(300, 70), new Rock(400, 70), new Rock(100, 70),
  new Rock(200, 70), new Rock(0, 70), new Rock(400, 240), new Rock(300, 240),
  new Rock(100, 240), new Rock(200, 240), new Rock(0, 240), new Rock(400, 155),
  new Rock(300, 155), new Rock(200, 155), new Rock(100, 155), new Rock(0, 155)
];

//Rocks loading
const allRocks = [myRocks[randomNumberGenerator()], myRocks[randomNumberGenerator()], myRocks[randomNumberGenerator()]];

var tempRockArrayNumber;
var firstRun = 0;
var saveRandom;

//Load the rocks on a random position
function randomNumberGenerator() {
  let saveRandom = Math.floor(Math.random() * 15);
  tempRockArrayNumber = saveRandom;
  firstRun++;
  return saveRandom;
}

//Stars bonus for every taken star
const allBonuses = [new Bonus(0, -8), new Bonus(100, -8), new Bonus(200, -8), new Bonus(300, -8), new Bonus(400, -8)];

// Player object in a variable called player
let player = new Player(200, 380);


// This listens for key presses and sends the keys to
// Player.handleInput() method.
document.addEventListener('keyup', function(e) {
  var allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  };

  player.handleInput(allowedKeys[e.keyCode]);
});
