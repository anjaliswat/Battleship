const readline = require('readline');
const readlineSync = require('readline-sync');

grid = [['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
        ['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
        ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
        ['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
        ['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'],
        ['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'],
        ['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'],
        ['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9'],
        ['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'],
        ['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9']]

//This function starts the game by asking user to enter the locations for the ships. It then proceeds with the game by calling
// playerMove, displayGrid and checkForWinner.
function play() {
  console.log(grid);

  player1Ships = [];
  player2Ships = [];
  player1Hits = [];
  player2Hits = [];
  player1Misses = [];
  player2Misses = [];
  winner = false;

  carrier1 = readlineSync.question('PLAYER 1: Enter start location for Carrier(Size = 5) : ').toUpperCase();
  carrier1 = displayOptions(carrier1, 5, player1Ships);
  player1Ships.push(carrier1);
  battleship1 = readlineSync.question('PLAYER 1: Enter start location for Battleship(Size = 4) : ').toUpperCase();
  battleship1 = displayOptions(battleship1, 4, player1Ships);
  player1Ships.push(battleship1);
  cruiser1 = readlineSync.question('PLAYER 1: Enter start location for Cruiser(Size = 3) : ').toUpperCase();
  cruiser1 = displayOptions(cruiser1, 3, player1Ships);
  player1Ships.push(cruiser1);
  submarine1 = readlineSync.question('Enter start location for Submarine(Size = 3) : ').toUpperCase();
  submarine1 = displayOptions(submarine1, 3, player1Ships);
  player1Ships.push(submarine1);
  destroyer1 = readlineSync.question('Enter start location for Destroyer(Size = 2) : ').toUpperCase();
  destroyer1 = displayOptions(destroyer1, 2, player1Ships);
  player1Ships.push(destroyer1);
  console.clear();

  carrier2 = readlineSync.question('Enter start location for Carrier(Size = 5) : ').toUpperCase();
  carrier2 = displayOptions(carrier2, 5, player2Ships);
  player2Ships.push(carrier2);
  battleship2 = readlineSync.question('Enter start location for Battleship(Size = 4) : ').toUpperCase();
  battleship2 = displayOptions(battleship2, 4, player2Ships);
  player2Ships.push(battleship2);
  cruiser2 = readlineSync.question('Enter start location for Cruiser(Size = 3) : ').toUpperCase();
  cruiser2 = displayOptions(cruiser2, 3, player2Ships);
  player2Ships.push(cruiser2);
  submarine2 = readlineSync.question('Enter start location for Submarine(Size = 3) : ').toUpperCase();
  submarine2 = displayOptions(submarine2, 3, player2Ships);
  player2Ships.push(submarine2);
  destroyer2 = readlineSync.question('Enter start location for Destroyer(Size = 2) : ').toUpperCase();
  destroyer2 = displayOptions(destroyer2, 2, player2Ships);
  player2Ships.push(destroyer2);
  console.clear();

//If there is no winner then keep playing
    while (winner != true) {
      playerMove('Player 1', carrier2, battleship2, cruiser2, submarine2, destroyer2, player1Hits, player1Misses);
      displayGrid('player1',player1Ships, player1Hits, player1Misses, player2Hits);
      endTurn();

      winner = checkForWinner('Player 1', carrier2, battleship2, cruiser2, submarine2, destroyer2);
      if(winner == true) {
        return
      }

      playerMove('Player 2', carrier1, battleship1, cruiser1, submarine1, destroyer1, player2Hits, player2Misses);
      displayGrid('player2', player2Ships, player1Hits, player2Misses, player2Hits);
      endTurn();

      winner = checkForWinner('Player 2', carrier1, battleship1, cruiser1, submarine1, destroyer1);
  }
}

//Displays the updated grid showing all the hits and misses and also the location of the players ships.
function displayGrid(player, ships, hits1, misses, hits2) {
  var updatedGrid = deepCloning(grid);
  for(i = 0;i < updatedGrid.length; i++) {
    for(j = 0;j < updatedGrid[i].length; j++) {
      for(k = 0;k < ships.length; k++){
        if(ships[k].includes(grid[i][j])) {
          updatedGrid[i][j] = 'S'
        }
      }
    }
  }

  for(i = 0;i < updatedGrid.length; i++) {
    for(j = 0;j < updatedGrid[i].length; j++) {
      if(player == 'player2') {
        if(hits1.includes(grid[i][j])) {
          updatedGrid[i][j] = 'P1 H'
        }
        else if(hits2.includes(grid[i][j])) {
          updatedGrid[i][j] = 'P2 H'
        }
      }
      if(player == 'player1') {
        if(hits2.includes(grid[i][j])) {
          updatedGrid[i][j] = 'P2 H'
        }
        else if(hits1.includes(grid[i][j])) {
          updatedGrid[i][j] = 'P1 H'
        }
      }
      if(misses.includes(grid[i][j])) {
        updatedGrid[i][j] = 'M'
      }
    }
  }
  console.log(updatedGrid);
}

//Asks user for a start point from where they want to enter their ship. Then shows the user all the options from that position.
function displayOptions(ship, size, allships) {
  shipValid = validateShip(ship);
  valid = validateOptions(ship, allships);
  while(valid == false) {
    ship = readlineSync.question('You have already placed a ship here. Please enter a different location :').toUpperCase();
    valid = validateOptions(ship, allships);
  }

  while(shipValid == false) {
    ship = readlineSync.question('This is not a valid location. Please enter a different location :').toUpperCase();
    shipValid = validateShip(ship);
  }

      options = []
      option1 = []
      option2 = []
      option3 = []
      option4 = []

      //horizontal right
      i = shipCoordinate2
      for(j = 0; j < size; j++) {
        if(i < grid[0].length) {
            option1.push(grid[shipCoordinate1][shipCoordinate2+j])
            i = i + 1
          }
      }

      i = shipCoordinate2
      for(j = 0; j < size; j++) {
          if(i >= 0) {
            option2.push(grid[shipCoordinate1][shipCoordinate2-j])
            i = i - 1;
          }
      }
      //vertical
      i = shipCoordinate1
      for(j = 0; j < size; j++) {
        if(i < grid.length) {
            option3.push(grid[shipCoordinate1+j][shipCoordinate2])
            i = i + 1
          }
      }

      i = shipCoordinate1
      for(j = 0; j < size; j++) {
          if(i >= 0) {
            option4.push(grid[shipCoordinate1-j][shipCoordinate2])
            i = i - 1;
          }
      }

      options.push(option1, option2, option3, option4);

      var dict = [];
      j = 0
      for(i = 0; i < options.length; i++) {
        if(options[i].length == size) {
          dict.push({
              key: j,
              value: options[i]
          });
          console.log(j + ': ' + options[i])
          j = j + 1
        }
      }

      selectedOption = readlineSync.question('Enter an option :');
      selectedOptionValid = validateSelectedOption(selectedOption, dict);
      while(selectedOptionValid != true) {
        selectedOption = readlineSync.question('This is not a valid option. Please enter a different option :').toUpperCase();
        selectedOptionValid = validateSelectedOption(selectedOption, dict);
      }
      return dict[selectedOption].value;
}

//It checks whether the coordinates entered for the ship are accurate or not.
function validateShip(ship) {
  for(i = 0; i < grid.length; i++) {
    for(j = 0; j < grid[i].length; j++) {
      if(ship == grid[i][j]) {
          shipCoordinate1 = i;
          shipCoordinate2 = j;
          return true;
        }
      }
    }
    return false;
}

//It makes sure that the options being provided to the user are valid options for placing the ship.
function validateOptions(option, ships) {
  valid = true
  for(i = 0; i < ships.length; i++) {
    for(j = 0; j < ships[i].length; j++) {
      if(ships[i][j] == option) {
        valid = false;
      }
    }
  }
  return valid;
}

//It makes sure the option selected by the user is from the list of options that have been provided to the user.
function validateSelectedOption(selectedOption, dict) {
  if(selectedOption < dict.length) {
    return true
  }
  else{
    return false
  }
}

//Asks the player for the location they want to attack. It then returns whether that attack was a hit, miss or it has already been attacked before.
function playerMove (player, carrier, battleship, cruiser, submarine, destroyer, hits, misses) {
  var valid = false;
  var sinkingShip = 0;
  var move = readlineSync.question(player + ' Enter a location : ').toUpperCase();
  for (row = 0; row < grid.length; row++) {
    if (grid[row].includes(move) == true) {
      valid = true;
    }
  }
  if (valid == true) {
    if (hits.includes(move) == true || misses.includes(move) == true) {
      console.log('Already Taken');
    }
    else if (carrier.includes(move)) {
      console.log('Hit');
      carrier.splice(carrier.indexOf(move), 1 );
      hits.push(move);
      sinkingShip = carrier;
    }
    else if (battleship.includes(move)) {
      console.log('Hit');
      battleship.splice(battleship.indexOf(move), 1 );
      hits.push(move);
      sinkingShip = battleship;
    }
    else if (cruiser.includes(move)) {
      console.log('Hit');
      cruiser.splice(cruiser.indexOf(move), 1 );
      hits.push(move);
      sinkingShip = cruiser;
    }
    else if (submarine.includes(move)) {
      console.log('Hit');
      submarine.splice(submarine.indexOf(move), 1 );
      hits.push(move);
      sinkingShip = submarine;
    }
    else if (destroyer.includes(move)) {
      console.log('Hit');
      destroyer.splice(destroyer.indexOf(move), 1 );
      hits.push(move);
      sinkingShip = destroyer;
    }
    else {
      console.log('Miss')
      misses.push(move)
      return
    }
    if (sinkingShip.length == 0) {
      console.log('Sunk')
    }
  }
}

//Lets the player view their grid and the hits and the misses until they want to end their turn.
function endTurn() {
  endturn = 'NO'
  while(endturn != 'YES') {
    endturn = readlineSync.question('Do you want to end your turn : ').toUpperCase();
  }
  console.clear();
}

//Creates a deep clone of the original grid so that when the updatedGrid is changed, it won't effect the original one.
function deepCloning(objectpassed) {
  if (objectpassed === null || typeof objectpassed !== 'object') {
     return objectpassed;
  }
  var temporarystorage = objectpassed.constructor();
    for (var key in objectpassed) {
      temporarystorage[key] = deepCloning(objectpassed[key]);
    }
    return temporarystorage;
}

//Checks if anyone won the game. If so, it will print out who won and end the game.
function checkForWinner (player, carrier, battleship, cruiser, submarine, destroyer) {
  if (carrier.length == 0 && battleship.length == 0 && cruiser.length == 0 && submarine.length == 0 && destroyer.length == 0) {
    console.log(player + 'Won');
    return(true)
  }
  return(false)
}

play()
