console.log("P6part2 Game");
function getRandomNum(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

var weaponDrops = ["weapon1", "weapon2", "weapon3", "weapon4"];

function player(health, attack, weapon) {
    this.health = health;
    this.attack = attack;
    this.weapon = weapon;
}

var player1 = new player(100, 10, "defaultWeapon");
var player2 = new player(100, 10, "defaultWeapon");

var tiles = $("#Board td");
var tilesArray = [];
var i = 0;
var w = 0;

function spawnWeapon() {
    randomTile.id = weaponDrops[w];
    tilesArray.push(randomTile);
    w++;
    i++;
}

//Generate the map
while (i < 16) {
    var randomTileNumber = getRandomNum(100);
    var randomTile = tiles[randomTileNumber];
    
    //Generate Blocked tiles
    if (!tilesArray.includes(randomTile) && i < 10) {
        randomTile.classList.add("blocked");
        tilesArray.push(randomTile);
        i++;
    
    //Generate Weapons
    } else if (!tilesArray.includes(randomTile) && i > 9 && i < 14) {
        spawnWeapon();
        
    //Player 1
    } else if (!tilesArray.includes(randomTile) && i === 14) {
        var player1TileNumber = randomTileNumber;
        var player1Tile = randomTile;
        player1Tile.id = "player1";
        tilesArray.push(player1Tile);
        i++;
        
    //Player 2 and does not spawn next to Player 1
    } else if (!tilesArray.includes(randomTile) && i === 15) {
        //Players don't touch
        var player2TileNumber = randomTileNumber;
        if (!(player2TileNumber === (player1TileNumber - 1) || player2TileNumber === (player1TileNumber + 1) || player2TileNumber === (player1TileNumber + 10) || player2TileNumber === (player1TileNumber + 11) || player2TileNumber === (player1TileNumber + 9) || player2TileNumber === (player1TileNumber - 10) || player2TileNumber === (player1TileNumber - 11) || player2TileNumber === (player1TileNumber - 9))) {
            var player2Tile = randomTile;
            player2Tile.id = "player2";
            tilesArray.push(player2Tile);
            i++;
        }
    }
} 

function findPlayerNumber(player) {
    var finder = $("#Board td");
    for (var i = 0; i < 100; i++) {
        if (finder[i].id === player) {
            return i;
        }
    }
}

var playerRegex = /player/;

function moveArea(player) {
    var whichPlayer = player[player.length - 1];
    var playerPosition = document.getElementById(player);
    var playerPositionNumber = findPlayerNumber(player);
    var playerRow = playerPosition.parentElement;
    var playerRowTile = playerRow.querySelectorAll("td");
    var playerRowNumber = 0;
    
    //Finds out what number on the row the player is
    while (playerRowTile[playerRowNumber].id !== player) {
        playerRowNumber++;
    }
    
    //Place move tiles on left of player
    var left = -1;
    while (left > -4) {
        var playerLeftReach = playerRowTile[playerRowNumber + left]; //Used to place move tiles (incremented)
        var playerLeftReachNumber = playerRowNumber + left; //Condition for finding if player is at border

        if (playerLeftReachNumber < 0) {
            break; // If at border, break
        } else {
            if (!playerLeftReach.classList.contains("blocked") && !(playerRegex.test(playerLeftReach.id))) {
                playerLeftReach.classList.add("move-area-p" + whichPlayer);
                left--;
            } else {
                break;
            }
        }
    }
    
    //Place move tiles on right of player
    var right = 1;
    while (right < 4) {
        var playerRightReach = playerRowTile[playerRowNumber + right];
        var playerRightReachNumber = playerRowNumber + right;

        if (playerRightReachNumber > 9) {
            break;
        } else {
            if (!playerRightReach.classList.contains("blocked") && !(playerRegex.test(playerRightReach.id))) {
                playerRightReach.classList.add("move-area-p" + whichPlayer);
                right++; 
            } else {
                break;
            }
        }
    }   
    
    //Place move tiles on top of player
    var above = -10;
    while (above > -40) {
        var playerTopReachNumber = playerPositionNumber + above;
        var playerTopReach = tiles[playerTopReachNumber];

        if (playerTopReachNumber < 0) {
            break;
        } else {
            if (!playerTopReach.classList.contains("blocked") && !(playerRegex.test(playerTopReach.id))) {
                playerTopReach.classList.add("move-area-p" + whichPlayer);
                above -= 10;
            } else {
                break;
            }
        }
    }

    //Place move tiles on bottom of player
    var below = 10;
    while (below < 40) {
        var playerBelowReachNumber = playerPositionNumber + below;
        var playerBelowReach = tiles[playerBelowReachNumber];
            
        if (playerBelowReachNumber > 99) {
            break;
        } else {
            if (!playerBelowReach.classList.contains("blocked") && !(playerRegex.test(playerBelowReach.id))) {
                playerBelowReach.classList.add("move-area-p" + whichPlayer);
                below += 10;
            } else {
                break;
            }
        }
    }
}

//Call first moveArea for start of game
moveArea("player1");

//Decide player turn
var switchPlayer = 1;
function isOdd(num) { return num % 2; }

function removeOldArea(player) {
    var whichPlayer = player[player.length - 1];
    var allMoveArea = document.getElementsByClassName("move-area-p" + whichPlayer);
    var i = 0;
    while (i < allMoveArea.length) {
        allMoveArea[i].classList.remove("move-area-p" + whichPlayer);
    }
}

//Weapon pickup and drop
var p1Attack = document.getElementById("p1Attack");
var p2Attack = document.getElementById("p2Attack");
var lastWeaponArrayP1 = [];
var lastWeaponArrayP2 = [];
var attackChangeEffect = document.getElementById("attack");

function weaponEquip(newWeapon, player) {
    var playerVar = eval(player);
    switch(newWeapon.id) {
        case "weapon1":
            playerVar.attack = 25;
            playerVar.weapon = "weapon1";
            break;
        case "weapon2":
            playerVar.attack = 30;
            playerVar.weapon = "weapon2";
            break;
        case "weapon3":
            playerVar.attack = 40;
            playerVar.weapon = "weapon3";
            break;
        case "weapon4":
            playerVar.attack = 30;
            playerVar.weapon = "weapon4";
            break;
    }
    if (player === "player1") {
        p1Attack.innerHTML = player1.attack;
        lastWeaponArrayP1.push(playerVar.weapon);
    } else {
        p2Attack.innerHTML = player2.attack;
        lastWeaponArrayP2.push(playerVar.weapon);
    }
}

function dropWeapon(lastPlace, player) {
    if (player === "player1" && player1.attack > 10) {
        lastPlace.id = lastWeaponArrayP1[0];
        lastWeaponArrayP1.shift();
    } else if (player === "player2") {
        lastPlace.id = lastWeaponArrayP2[0];
        lastWeaponArrayP2.shift();
    }
}

var weaponRegex = /weapon(?!default)/;

function classToggle(element) {
    var element = document.getElementById(element);
    var cloneElement = element.cloneNode();
    element.parentNode.replaceChild(cloneElement, element);
}

var adjacentCalledOnce = false;
//Check if players are adjacent
function playerAdjacent(player, enemy) {
    var playerElement = document.getElementById(player);
    var playerNumber = findPlayerNumber(player);
    var playerRow = document.getElementById(player).parentElement;
    var playerRowTiles = playerRow.querySelectorAll("td");
    var playerRowNumber = 0;
    
    while (playerRowTiles[playerRowNumber].id !== player) {
        playerRowNumber++;
    }

    var leftOfPlayer = playerRowTiles[playerRowNumber - 1];
    var rightOfPlayer = playerRowTiles[playerRowNumber + 1];
    var topOfPlayer = tiles[playerNumber - 10];
    var bottomOfPlayer = tiles[playerNumber + 10];
    
    //Call Attack function in here
    if (!(playerRowNumber - 1 < 0) && playerRegex.test(leftOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-left");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    } else if (!(playerRowNumber + 1 > 9) && playerRegex.test(rightOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-right");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    } else if (!(playerNumber - 10 < 0) && playerRegex.test(topOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-top");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    } else if (!(playerNumber + 10 > 99) && playerRegex.test(bottomOfPlayer.id)) {
        if (adjacentCalledOnce === true) {
            playerElement.classList.add("attackPlayer-bottom");
            classToggle(player);
        } else {
            adjacentCalledOnce = true;
            return true;
        }
    }
}

function defendAnimation(player) {
    var defendPlayer = document.getElementById(player + "Defense");
    defendPlayer.style.visibility = "visible";
    defendPlayer.classList.add("defend-animation");
    classToggle(player + "Defense");
}

//--------------------Attack bar?
function attackH2Animation(player, color, weapon) {
    var attackH2Img = document.getElementById(player + "AttackPic");
    var attackH2Color = document.getElementById(player + "AttackColor");
    
    attackH2Img.src = "Images/" + weapon + ".png";
    attackH2Color.style.background = "radial-"
    
}

function renewFeed(playerFeed) {
    var feedVar = document.getElementById(playerFeed);
    while (feedVar.hasChildNodes()) {
        feedVar.removeChild(feedVar.firstChild);
    }
}

var winDiv = document.getElementById("winner");
var winH1 = document.getElementById("winner-name");

function winnerAnimation(player) {
    winDiv.classList.add("show-win-div");
    winH1.innerHTML = player.toUpperCase() + " WINS!"
    winH1.classList.add("show-win-h1");
}

//Messages
var winner = " WINS!";
var hurt = "Careful, your health is low";
var critical = "You are at critical health!";
var p1Feed = document.getElementById("p1Feed");
var p2Feed = document.getElementById("p2Feed");

function feed(message, player) {
    var playerVar = eval(player);
    var whichPlayer = player[player.length - 1];
    var playerFeed = "p" + whichPlayer + "Feed";
    var playerFeedVar = eval(playerFeed);
    var enermyPlayerNum = whichPlayer === "1" ? "2" : "1";
    var enemyPlayerFeed = "p" + enermyPlayerNum + "Feed";
    var enemyPlayerFeedVar = eval(enemyPlayerFeed);
    
    renewFeed(playerFeed);
    var newMessage = document.createElement("p");
    switch (message) {
        case ("winner"):
        renewFeed(enemyPlayerFeed);
        winnerAnimation(player);
        break;
                
        case ("hurt"):
        newMessage.innerHTML = hurt;
        playerFeedVar.appendChild(newMessage);
        break;
                
        case ("critical"):
        newMessage.innerHTML = critical;
        playerFeedVar.appendChild(newMessage);
        break;
                
        case ("attack"):
        newMessage.innerHTML = player + " dealt " + playerVar.attack + " damage!";
        playerFeedVar.appendChild(newMessage);
        break;
                
        case ("blockedAttack"):
        newMessage.innerHTML = player + " only dealt " + playerVar.attack/2 + " damage";
        playerFeedVar.appendChild(newMessage);
        break;
        }
}

function attack(player) {
    var whichPlayer = player[player.length - 1];
    var playerVar = eval("player" + whichPlayer);
    var enemyPlayerNum = whichPlayer === "1" ? "2" : "1";
    var enemyPlayer = "player" + enemyPlayerNum;
    var enemyPlayerVar = eval(enemyPlayer);
    
    if (defenseClicked === false) {
        enemyPlayerVar.health -= playerVar.attack;
        feed("attack", player);
        health(enemyPlayer);
    } else if (defenseClicked === true) {
        enemyPlayerVar.health -= playerVar.attack/2;
        feed("blockedAttack", player);
        health(enemyPlayer);
    }
}

var defenseClicked = false;
function defend() {
    defenseClicked = true;
}


var p1Health = document.getElementById("p1Health");
var p1HealthColor = document.getElementById("p1HealthColor");
var p2Health = document.getElementById("p2Health");
var p2HealthColor = document.getElementById("p2HealthColor");

function health(player) {
    var playerVar = eval(player);
    var whichPlayer = player[player.length - 1];
    var playerHealthVar = eval("p" + whichPlayer + "Health");
    var playerHealthColorVar = eval("p" + whichPlayer + "HealthColor");
    
    var enermyPlayerNum = whichPlayer === "1" ? "2" : "1";
    
    if (playerVar.health > 0) {
        playerHealthVar.innerHTML = playerVar.health;
        
        if (playerVar.health <= 60 && playerVar.health > 25) {
            playerHealthColorVar.style.backgroundColor = "#f7b527";
            feed("hurt", player);
        } else if (playerVar.health <= 25) {
            playerHealthColorVar.style.backgroundColor = "#ef2617";
            feed("critical", player);
        }
    } else {
        playerVar.health = 0;
        playerHealthVar.innerHTML = playerVar.health;
        if (playerVar.health <= 0) {
            bgMusic.pause();
            winEffect();
            feed("winner", "player" + enermyPlayerNum);
            blockButtons("player" + whichPlayer + "Buttons");
        }
    }
}

//Display which player turn it is
var player1Buttons = document.getElementById("player1Interface").querySelectorAll("button");
var player2Buttons = document.getElementById("player2Interface").querySelectorAll("button");

function activateButtons(playerButtons) {
    var buttons = eval(playerButtons);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.add("activeButtons");
    }
}

function blockButtons(playerButtons) {
    var buttons = eval(playerButtons);
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("activeButtons");
    }
}

function moveRoutine(e, player, enemy) {
    var target = e.target;
    if (weaponRegex.test(target.id)) {
        var lastTile = document.getElementById(player);
        lastTile.id = "";
        dropWeapon(lastTile, player);
        weaponEquip(target, player);
        removeOldArea(player);
        target.setAttribute("id", player);
        if (playerAdjacent(player) === true) {
            activateButtons(player + "Buttons");
        } else {
            moveArea(enemy);
            switchPlayer++;  
        }
        //If target is move area
    } else {
        removeOldArea(player);
        var lastTile = document.getElementById(player);
        lastTile.id = "";
        e.target.setAttribute("id", player);
        if (playerAdjacent(player) === true) {
            activateButtons(player + "Buttons");
        } else {
            moveArea(enemy);
            switchPlayer++;
        }
    }
}

function attackRoutine(player, enemy) {
    blockButtons(player + "Buttons");
    activateButtons(enemy + "Buttons");
    attack(player);
    playerAdjacent(player);
    punchEffect(player);
    defenseClicked = false;
    var defendPlayer = document.getElementById(enemy + "Defense");
    defendPlayer.style.visibility = "hidden";
    switchPlayer++;
}

function defendRoutine(player, enemy) {
    blockButtons(player + "Buttons");
    activateButtons(enemy + "Buttons");
    defendAnimation(player);
    defendEffect();
    defend();
    switchPlayer++;
}

$(document).ready(function() {
  $(document).on("click", function(e) {
    if (isOdd(switchPlayer) === 1 && e.target.className === "move-area-p1") {
        moveRoutine(e, "player1", "player2");
        
    } else if (isOdd(switchPlayer) === 0 && e.target.className === "move-area-p2") {
        moveRoutine(e, "player2", "player1");
        
    //Players adjacent can now press buttons
    } else if (player1.health > 0 && player2.health > 0 && adjacentCalledOnce === true) {  
        if (e.target.id === "p1Attack" && isOdd(switchPlayer) === 1) {
            attackRoutine("player1", "player2");
        } else if (e.target.id === "p2Attack" && isOdd(switchPlayer) === 0) {
            attackRoutine("player2", "player1");
        } else if (e.target.id === "p1Defend" && isOdd(switchPlayer) === 1) {
            defendRoutine("player1", "player2");
        } else if (e.target.id === "p2Defend" && isOdd(switchPlayer) === 0) {
            defendRoutine("player2", "player1");
        }
    }
  });
});

//Sounds and effects
var bgMusic = document.getElementById("Bg-Music");
bgMusic.volume = 0.3;

//Object constructor for effects
function effect(src) {
    this.effect = document.createElement("audio");
    this.effect.src = src;
    this.effect.style.display = "none";
    document.body.appendChild(this.effect);
    this.effect.play();
}

var throwHitP1;
var throwHitP2;
function punchEffect(player) {
    if (player === "player1") {
        throwHitP1 = new effect("audio/punch.wav");
    } else {
        setTimeout(function() {
            throwHitP2 = new effect("audio/slap.wav");
        }, 400);
    }
}

var defendSound;
function defendEffect() {
    defendSound = new effect("audio/defend.wav");
}

var winSound;
function winEffect() {
    winSound = new effect("audio/winner.wav");
}