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

//Step 1: Generate the Map
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
    //Cannot figure out how to make if statement shorter
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

//Step 2 - Movement
//Horizontal movement restricted to row, vertical movement tiles.length +10 to +30 or -10 to -30
//------------------------------ JQuery from here

function findPlayerNumber(player) {
    var finder = $("#Board td");
    for (var i = 0; i < 100; i++) {
        if (finder[i].id === player) {
            return i;
        }
    }
}

//Define areas available to move to after finding P1 position
function moveAreaP1() {
    var player1Position = document.getElementById("player1");
    var player1PositionNumber = findPlayerNumber("player1");
    var player1Row = player1Position.parentElement;
    var player1RowTile = player1Row.querySelectorAll("td");
    var player1RowTileNumber = 0;
    
    //Finds out what number on the row the player is
    while (player1RowTile[player1RowTileNumber].id !== "player1") {
        player1RowTileNumber++;
    }
    
    //Place move tiles on left of player
    var left = -1;
    while (left > -4) {
        var player1LeftReach = player1RowTile[player1RowTileNumber + left]; //Used to place move tiles (incremented)
        var player1LeftReachNumber = player1RowTileNumber + left; //Condition for finding if player is at border

        if (player1LeftReachNumber < 0) {
            break; // If at border, break
        } else {
            if (!player1LeftReach.classList.contains("blocked") && !(player1LeftReach.id === "player2")) {
                player1LeftReach.classList.add("move-area-p1");
                left--;
            } else {
                break;
            }
        }
    }
    
    //Place move tiles on right of player
    var right = 1;
    while (right < 4) {
        var player1RightReach = player1RowTile[player1RowTileNumber + right];
        var player1RightReachNumber = player1RowTileNumber + right;

        if (player1RightReachNumber > 9) {
            break;
        } else {
            if (!player1RightReach.classList.contains("blocked") && !(player1RightReach.id === "player2")) {
                player1RightReach.classList.add("move-area-p1");
                right++;
            } else {
                break;
            }
        }
    }   
    
    //Place move tiles on top of player
    var above = -10;
    while (above > -40) {
        var player1TopReachNumber = player1PositionNumber + above;
        var player1TopReach = tiles[player1TopReachNumber];

        if (player1TopReachNumber < 0) {
            break;
        } else {
            if (!player1TopReach.classList.contains("blocked") && !(player1TopReach.id === "player2")) {
                player1TopReach.classList.add("move-area-p1");
                above -= 10;
            } else {
                break;
            }
        }
    }

    //Place move tiles on bottom of player
    var below = 10;
    while (below < 40) {
        var player1BelowReachNumber = player1PositionNumber + below;
        var player1BelowReach = tiles[player1BelowReachNumber];
            
        if (player1BelowReachNumber > 99) {
            break;
        } else {
            if (!player1BelowReach.classList.contains("blocked") && !(player1BelowReach.id === "player2")) {
                player1BelowReach.classList.add("move-area-p1");
                below += 10;
            } else {
                break;
            }
        }
    }
}

//Player 2
//Define areas available to move to after finding P1 position
function moveAreaP2() {
    var player2Position = document.getElementById("player2");
    var player2PositionNumber = findPlayerNumber("player2");
    var player2Row = player2Position.parentElement;
    var player2RowTile = player2Row.querySelectorAll("td");
    var player2RowTileNumber = 0;
    
    while (player2RowTile[player2RowTileNumber].id !== "player2") {
        player2RowTileNumber++;
    }

    var left = -1;
    while (left > -4) {
        var player2LeftReach = player2RowTile[player2RowTileNumber + left];
        var player2LeftReachNumber = player2RowTileNumber + left;

        if (player2LeftReachNumber < 0) {
            break;
        } else {
            if (!player2LeftReach.classList.contains("blocked") && !(player2LeftReach.id === "player1")) {
                player2LeftReach.classList.add("move-area-p2");
                left--;
            } else {
                break;
            }
        }
    }
    
    var right = 1;
    while (right < 4) {
        var player2RightReach = player2RowTile[player2RowTileNumber + right];
        var player2RightReachNumber = player2RowTileNumber + right;

        if (player2RightReachNumber > 9) {
            break;
        } else {
            if (!player2RightReach.classList.contains("blocked") && !(player2RightReach.id === "player1")) {
                player2RightReach.classList.add("move-area-p2");
                right++;
            } else {
                break;
            }
        }
    }   
    
    var above = -10;
    while (above > -40) {
        var player2TopReachNumber = player2PositionNumber + above;
        var player2TopReach = tiles[player2TopReachNumber];

        if (player2TopReachNumber < 0) {
            break;
        } else {
            if (!player2TopReach.classList.contains("blocked") && !(player2TopReach.id === "player1")) {
                player2TopReach.classList.add("move-area-p2");
                above -= 10;
            } else {
                break;
            }
        }
    }

    var below = 10;
    while (below < 40) {
        var player2BelowReachNumber = player2PositionNumber + below;
        var player2BelowReach = tiles[player2BelowReachNumber];
            
        if (player2BelowReachNumber > 99) {
            break;
        } else {
            if (!player2BelowReach.classList.contains("blocked") && !(player2BelowReach.id === "player1")) {
                player2BelowReach.classList.add("move-area-p2");
                below += 10;
            } else {
                break;
            }
        }
    }
}

//Call first moveArea for start of game
moveAreaP1();

//Decide player turn
var switchPlayer = 1;
function isOdd(num) { return num % 2; }

function removeOldAreaP1() {
    var allMoveAreaP1 = document.getElementsByClassName("move-area-p1");
    var i = 0;
    while (i < allMoveAreaP1.length) {
        allMoveAreaP1[i].classList.remove("move-area-p1");
    }
}

function removeOldAreaP2() {
    var allMoveAreaP2 = document.getElementsByClassName("move-area-p2");
    var i = 0;
    while (i < allMoveAreaP2.length) {
        allMoveAreaP2[i].classList.remove("move-area-p2");
    }
}

//Weapon pickup and drop
//Why does getting element with JQuery not work well?
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
var playerRegex = /player/;

//Check if players are adjacent
function playerAdjacent(player) {
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
        return true;
    } else if (!(playerRowNumber + 1 > 9) && playerRegex.test(rightOfPlayer.id)) {
        return true;
    } else if (!(playerNumber - 10 < 0) && playerRegex.test(topOfPlayer.id)) {
         return true;
    } else if (!(playerNumber + 10 > 99) && playerRegex.test(bottomOfPlayer.id)) {
        return true;
    }
}

//--------------------------------------------------------------------Work on this - Animate button click
/*var p1Feed = document.getElementById("p1Feed");
        while (p1Feed.hasChildNodes()) {
            p1Feed.removeChild(p1Feed.firstChild);
        }
var p2Feed = document.getElementById("p2Feed");
        while (p2Feed.hasChildNodes()) {
            p2Feed.removeChild(p2Feed.firstChild);
        } */

//-------------------------USE SWITCH PLAYER

function renewFeed(playerFeed) {
    var feedVar = document.getElementById(playerFeed);
    while (feedVar.hasChildNodes()) {
        feedVar.removeChild(feedVar.firstChild);
    }
}

//Messages
var winner = " WINS!";
var hurt = "Careful, your health is low";
var critical = "You are at critical health!";
var p1Feed = document.getElementById("p1Feed");
var p2Feed = document.getElementById("p2Feed");

function feed(message, playerX) {
    var playerVar = eval(playerX);
    if (playerX === "player1") {
        renewFeed("p1Feed");
        var newMessage = document.createElement("p");
        var enemyWinMessage = document.createElement("p");
        switch (message) {
            case ("winner"):
            renewFeed("p2Feed");
            newMessage.innerHTML = playerX + winner;
            enemyWinMessage.innerHTML = playerX + winner;
            p1Feed.appendChild(newMessage);
            p2Feed.appendChild(enemyWinMessage);
            break;
                
            case ("hurt"):
            newMessage.innerHTML = hurt;
            p1Feed.appendChild(newMessage);
            break;
                
            case ("critical"):
            newMessage.innerHTML = critical;
            p1Feed.appendChild(newMessage);
            break;
                
            case ("attack"):
            newMessage.innerHTML = playerX + " dealt " + playerVar.attack + " damage!";
            p1Feed.appendChild(newMessage);
            break;
                
            case ("blockedAttack"):
            newMessage.innerHTML = playerX + " only dealt " + playerVar.attack/2 + " damage";
            p1Feed.appendChild(newMessage);
            break;
        }
    } else if (playerX === "player2") {
        renewFeed("p2Feed");
        var newMessage = document.createElement("p");
        var enemyWinMessage = document.createElement("p");
        switch (message) {
            case ("winner"):
            renewFeed("p1Feed");
            newMessage.innerHTML = playerX + winner;
            enemyWinMessage.innerHTML = playerX + winner;
            p1Feed.appendChild(newMessage);
            p2Feed.appendChild(enemyWinMessage);
            break;
                
            case ("hurt"):
            newMessage.innerHTML = hurt;
            p2Feed.appendChild(newMessage);
            break;
                
            case ("critical"):
            newMessage.innerHTML = critical;
            p2Feed.appendChild(newMessage);
            break;
                
            case ("attack"):
            newMessage.innerHTML = playerX + " dealt " + playerVar.attack + " damage!";
            p2Feed.appendChild(newMessage);
            break;
            
            case ("blockedAttack"):
            newMessage.innerHTML = playerX + " only dealt " + playerVar.attack/2 + " damage";
            p2Feed.appendChild(newMessage);
            break;
        }
    }
}



function attack(player) {
    if (isOdd(switchPlayer) === 1) {
       if (player === "player1" && defenseClicked === false) {
            player2.health -= player1.attack;
            feed("attack", "player1");
            health("player2");
        } else if (player === "player1" && defenseClicked === true) {
            player2.health -= player1.attack/2;
            feed("blockedAttack", "player1");
            health("player2");
        }
    } else {
        if (player === "player2" && defenseClicked === true) {
            player1.health -= player2.attack/2;
            feed("blockedAttack", "player2");
            health("player1");
        } else if (player === "player2" && defenseClicked === false) {
            player1.health -= player2.attack;
            feed("attack", "player2");
            health("player1");
        }
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
    if (player1.health > 0 && player2.health > 0) {
        p1Health.innerHTML = player1.health;
        p2Health.innerHTML = player2.health;
        
        if (player === "player1" && playerVar.health <= 60 && playerVar.health > 25) {
            p1HealthColor.style.backgroundColor = "#f7b527";
            feed("hurt", "player1");
        } else if (player === "player1" && playerVar.health <= 25) {
            p1HealthColor.style.backgroundColor = "#ef2617";
            feed("critical", "player1");
        } else if (player === "player2" && playerVar.health <= 60 && playerVar.health > 25) {
            p2HealthColor.style.backgroundColor = "#f7b527";
            feed("hurt", "player2");
        } else if (player === "player2" && playerVar.health <= 25) {
            p2HealthColor.style.backgroundColor = "#ef2617";
            feed("critical", "player2");
        }
    } else {
        playerVar.health = 0;
        p1Health.innerHTML = player1.health;
        p2Health.innerHTML = player2.health;
        if (player1.health <= 0) {
            feed("winner", "player2");
            blockButtons("player1Buttons");
        } else if (player2.health <= 0) {
            feed("winner", "player1");
            blockButtons("player2Buttons");
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

$(document).ready(function() {
  $(document).on("click", function(e) {
    if (isOdd(switchPlayer) === 1 && e.target.className === "move-area-p1") {
        var target = e.target;
        //If target is a weapon
        if (weaponRegex.test(target.id)) {
            var lastTile = document.getElementById("player1");
            lastTile.id = "";
            dropWeapon(lastTile, "player1");
            weaponEquip(target, "player1");
            removeOldAreaP1();
            target.setAttribute("id", "player1");
            if (playerAdjacent("player1") === true) {
               activateButtons("player1Buttons");
            } else {
              moveAreaP2();
              switchPlayer++;  
            }
        //If target is move area
        } else {
            removeOldAreaP1();
            var lastTile = document.getElementById("player1");
            lastTile.id = "";
            e.target.setAttribute("id", "player1");
            if (playerAdjacent("player1") === true) {
                activateButtons("player1Buttons");
            } else {
              moveAreaP2();
              switchPlayer++;
            }
        }
        
    } else if (isOdd(switchPlayer) === 0 && e.target.className === "move-area-p2") {
        var target = e.target;
        if (weaponRegex.test(target.id)) {
            var lastTile = document.getElementById("player2");
            lastTile.id = "";
            dropWeapon(lastTile, "player2");
            weaponEquip(target, "player2");
            removeOldAreaP2();
            e.target.setAttribute("id", "player2");
            if (playerAdjacent("player2") === true) {
                activateButtons("player2Buttons");
            } else {
              moveAreaP1();
              switchPlayer++;  
            }
        } else {     
            removeOldAreaP2();
            var lastTile = document.getElementById("player2");
            lastTile.id = "";
            e.target.setAttribute("id", "player2");
            if (playerAdjacent("player2") === true) {
                activateButtons("player2Buttons");
            } else {
               moveAreaP1();
               switchPlayer++; 
            }
        }
        
    //Players adjacent can now press buttons
    } else if (player1.health > 0 && player2.health > 0) {  
        if (e.target.id === "p1Attack" && isOdd(switchPlayer) === 1) {
            blockButtons("player1Buttons");
            activateButtons("player2Buttons");
            attack("player1");
            defenseClicked = false;
            switchPlayer++;
        } else if (e.target.id === "p2Attack" && isOdd(switchPlayer) === 0) {
            blockButtons("player2Buttons");
            activateButtons("player1Buttons");
            attack("player2");
            defenseClicked = false;
            switchPlayer++;
        } else if (e.target.id === "p1Defend" && isOdd(switchPlayer) === 1) {
            blockButtons("player1Buttons");
            activateButtons("player2Buttons");
            defend();
            switchPlayer++;
        } else if (e.target.id === "p2Defend" && isOdd(switchPlayer) === 0) {
            blockButtons("player2Buttons");
            activateButtons("player1Buttons");
            defend();
            switchPlayer++;
        }
    }
  });
});
