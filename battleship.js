const readline = require('readline');
const readlineSync = require('readline-sync');

class Board {
	constructor() {
		this.grid = [['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A7', 'A8', 'A9'],
          			['B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'B7', 'B8', 'B9'],
          			['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'],
          			['D1', 'D2', 'D3', 'D4', 'D5', 'D6', 'D7', 'D8', 'D9'],
          			['E1', 'E2', 'E3', 'E4', 'E5', 'E6', 'E7', 'E8', 'E9'],
          			['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9'],
          			['G1', 'G2', 'G3', 'G4', 'G5', 'G6', 'G7', 'G8', 'G9'],
          			['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9'],
          			['I1', 'I2', 'I3', 'I4', 'I5', 'I6', 'I7', 'I8', 'I9'],
          			['J1', 'J2', 'J3', 'J4', 'J5', 'J6', 'J7', 'J8', 'J9']]
	}
}

//Player has the attributes name(Player 1 or Player 2), ships(An array of all the players ships locations)
//hits(All the players hits throughout the game) and misses(All the players misses throughout the game)
class Player {
	constructor(name) {
		this.name = name;
		this.ships = [];
		this.hits = [];
		this.misses = [];
	}
}

//Ship has the attributes name(Carrier, Battleship etc.), value(Stores what locations the ships are placed at on the grid like
// A1 A2 A3 A4 A5), xpos(Starting position x coordinate), ypos(Starting position y coordinate), size(5 for Carrier, 4 for Battleship etc.)
class Ship {
	constructor(size, name){
		this.name = name;
		this.value = [];
		this.xpos = '';
		this.ypos = '';
		this.size = size;
	}
}

class Game {
	gameLoop() {
    var board = new Board();
    var grid = board.grid;

    var player1 = new Player("Player 1");
  	var player2 = new Player("Player 2");


    //Player 1 gets prompts for placing all the ships.
		console.log(grid);
		var carrier1 = new Ship(5, 'Carrier');
		this.placeShip(carrier1, player1, grid)
		var battleship1 = new Ship(4, 'Battleship');
		this.placeShip(battleship1, player1, grid)
		var cruiser1 = new Ship(3, 'Cruiser');
		this.placeShip(cruiser1, player1, grid)
		var submarine1 = new Ship(3, 'Submarine');
		this.placeShip(submarine1, player1, grid)
		var destroyer1 = new Ship(2, 'Destroyer');
		this.placeShip(destroyer1, player1, grid)
		console.clear();

    //Player 2 gets prompts for placing all the ships.
		console.log(grid);
		var carrier2 = new Ship(5, 'Carrier');
		this.placeShip(carrier2, player2, grid)
		var battleship2 = new Ship(4, 'Battleship');
		this.placeShip(battleship2, player2, grid)
		var cruiser2 = new Ship(3, 'Cruiser');
		this.placeShip(cruiser2, player2, grid)
		var submarine2 = new Ship(3, 'Submarine');
		this.placeShip(submarine2, player2, grid)
		var destroyer2 = new Ship(2, 'Destroyer');
		this.placeShip(destroyer2, player2, grid)
		console.clear();

    //Created 2 grids which display the location of the ships for player 1 and player 2 respectively.
		var player1ShipsGrid = this.displayShips(player1, grid);
		var player2ShipsGrid = this.displayShips(player2, grid);

    //Until there is no winner, the following statements will keep executing.
		var winner = false;
		while (winner != true) {
			this.beginTurn(player1);
      console.log('THIS GRID SHOWS WHERE YOUR SHIPS ARE PLACED (S)');
			console.log(player1ShipsGrid);
			this.displayAttacks(player1, player2, grid);
			this.playerMove(player1, player2, grid);
			winner = this.checkForWinner(player1, player2);
			if(winner == true) {
				return
			}
			this.displayAttacks(player1, player2, grid);
			this.endTurn();

			this.beginTurn(player2);
			console.log(player2ShipsGrid)
			this.displayAttacks(player2, player1, grid );
			this.playerMove(player2, player1, grid);
			winner = this.checkForWinner(player2, player1);
			this.displayAttacks(player2, player1, grid);
			this.endTurn();
		}
	}

  //Prompts the player to enter a start location for the ship. Validates the player input and if it isn't valid asks
  //player to enter a different location.
	placeShip(ship, player, grid) {
		var loc = readlineSync.question(player.name + ' Enter start location for ' + ship.name + ' : ').toUpperCase();
		var valid = this.checkIfOnGrid(loc, grid);
		while(valid != true) {
			loc = readlineSync.question('This is not a valid input. Please enter a different location :').toUpperCase();
			valid = this.checkIfOnGrid(loc, grid);
		}
		var op = this.displayOptions(loc, ship, player, grid);
		while(op == false) {
			loc = readlineSync.question('This ship is overlapping with another ship. Try entering a different location!').toUpperCase();
			op = this.displayOptions(loc, ship, player, grid);
		}
		ship.value = op;
		player.ships.push(ship.value);
	}

  //Asks the players if they are ready for their turn at the start of each players turn. On clicking Y it will display
  //the players grids and ask the player to make a move.
  beginTurn(player) {
    if(readlineSync.keyInYN(player.name + ' Are you ready to start your turn? :')) {
      return
    }
    else {
      this.beginTurn(player)
    }
	}

  //Checks that the position being entered by the player is on the grid.
	checkIfOnGrid(location, grid) {
	  for(var i = 0; i < grid.length; i++) {
	    for(var j = 0; j < grid[i].length; j++) {
	      if(location == grid[i][j]) {
	          return true;
	        }
	      }
	    }
		return false;
	}

  //Checks if the position being entered by the player is already occupied by another ship.
	checkIfOccupied(option, player) {
		for(var i = 0; i < player.ships.length; i++){
			for(var j = 0; j < option.length; j++) {
				if(player.ships[i].includes(option[j])) {
					return true;
				}
			}
		}
		return false;
	}

  //Checks if the option the user is entering is from the list being provided to the user.
	validateSelectedOption(selectedOption, dict) {
	  if(selectedOption < dict.length) {
	    return true
	  }
	  else{
	    return false
	  }
	}

  //Asks player to enter a location for attacking. Then checks whether this locations has already been taken or if it's a hit or a miss.
  //Also checks whether the ship that has been attacked has sunk or not.
	playerMove(playerAttacking, playerUnderAttack, grid) {
    var valid = false;
		var sinkingShip = 0;
		var move = readlineSync.question(playerAttacking.name + ' Enter a location : ').toUpperCase();
    valid = this.checkIfOnGrid(move, grid);
    while(valid == false) {
      move = readlineSync.question('This is not a valid input. Please enter a different location :').toUpperCase();
      valid = this.checkIfOnGrid(move, grid);
    }
    valid = false;
		for (var row = 0; row < grid.length; row++) {
			if (grid[row].includes(move) == true) {
				valid = true;
			}
		}
		if (valid == true) {
			if (playerAttacking.hits.includes(move) == true || playerAttacking.misses.includes(move) == true) {
				console.log('Already Taken');
        return;
			}
			for(var i = 0; i < playerUnderAttack.ships.length; i++) {
				if(playerUnderAttack.ships[i].includes(move)) {
					console.log('Hit');
					playerUnderAttack.ships[i].splice(playerUnderAttack.ships[i].indexOf(move), 1 );
					playerAttacking.hits.push(move);
					if(playerUnderAttack.ships[i].length == 0) {
						console.log('Sunk');
						return;
					}
					return;
				}
			}
				console.log('Miss');
				playerAttacking.misses.push(move);
				return;
		}
	}

  //When the player enters the start point, display options will display all the possible options from that point.
	displayOptions(loc, ship, player, grid) {
		for(var i = 0; i < grid.length; i++) {
			for(var j = 0; j < grid[i].length; j++) {
				if(loc == grid[i][j]) {
						ship.xpos = i;
						ship.ypos = j;
					}
				}
			}
		//horizontal right
    var option1 = [];
		var i = ship.ypos;
		for(var j = 0; j < ship.size; j++) {
			if(i < grid[0].length) {
				option1.push(grid[ship.xpos][ship.ypos+j]);
				i = i + 1;
			}
		}
    //horizontal left
    var option2 = [];
		i = ship.ypos;
		for(var j = 0; j < ship.size; j++) {
			if(i >= 0) {
				option2.push(grid[ship.xpos][ship.ypos-j]);
				i = i - 1;
			}
		}
		//vertical down
    var option3 = [];
		i = ship.xpos;
		for(var j = 0; j < ship.size; j++) {
			if(i < grid.length) {
				option3.push(grid[ship.xpos+j][ship.ypos]);
				i = i + 1;
			}
		}
    //vertical up
    var option4 = [];
		i = ship.xpos;
		for(var j = 0; j < ship.size; j++) {
			if(i >= 0) {
				option4.push(grid[ship.xpos-j][ship.ypos]);
				i = i - 1;
			}
		}

    j = 0;
    var options = [];
    options.push(option1, option2, option3, option4)
    var dict = [];
    for(var i = 0; i < options.length; i++) {
      if(options[i].length == ship.size) {
        var occupied = this.checkIfOccupied(options[i], player)
        if(occupied == false) {
          dict.push({
            key: j,
            value: options[i]
          });
          console.log(j + ': ' + options[i]);
          j = j + 1;
        }
      }
    }

    //Proceeds if the dict.length is not equal to zero. Because if it were equal to zero that would mean there are no options.
    if(dict.length != 0) {
			var selectedOption = readlineSync.question('Enter an option :');
			var valid = this.validateSelectedOption(selectedOption, dict)
			while(valid != true) {
				selectedOption = readlineSync.question('This is not a valid input. Please enter a different location :').toUpperCase();
				valid = this.validateSelectedOption(selectedOption, dict)
			}
			return dict[selectedOption].value;
    }
		else {
			return false;
		}
	}

  //Based on what options the player has selected for placing their ships, the ships will be displayed on the grid.
	displayShips(player, grid) {
		var board = new Board();
		var shipsGrid = board.grid;

		for(var i = 0; i < shipsGrid.length; i++) {
			for(var j = 0; j < shipsGrid[i].length; j++) {
				for(var k = 0; k < player.ships.length; k++){
					if(player.ships[k].includes(grid[i][j]))
						shipsGrid[i][j] = ' S'
				}
			}
		}
		return(shipsGrid);
	}

  //Displays the attacks, hits and misses on the grid. If both the players have Hit the same location then the player who's
  //turn it currently is, will see their attack.
	displayAttacks(playerAttacking, playerUnderAttack, grid) {
		var board = new Board();
		var attacksGrid = board.grid;

		for(var i = 0; i < attacksGrid.length; i++) {
			for(var j = 0; j < attacksGrid[i].length; j++) {
				if(playerAttacking.name == 'Player 1') {
					if(playerAttacking.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P1H'
					}
					else if(playerUnderAttack.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P2H'
					}
				}
        else {
					if(playerAttacking.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P2H'
					}
					else if(playerUnderAttack.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P1H'
					}
        }
				if(playerAttacking.misses.includes(grid[i][j])) {
					attacksGrid[i][j] = ' M'
				}
			}
		}
		console.log('THIS GRID SHOWS THE LOCATION OF YOUR ATTACKS, MISSES AND THE OPPONENTS ATTACKS.(P1H = Player 1 Hit) (P2H = Player 2 Hit) (M = Your Misses)')
		console.log(attacksGrid);
	}

  //Asls if the player is done with their turn. If they type Y then the console will be cleared.
	endTurn() {
    if(readlineSync.keyInYN('Do you want to end your turn :')) {
      console.clear();
    }
    else {
      this.endTurn();
    }
	}

  //Checks if the player has won or not by checking if all the other players ships are empty.
	checkForWinner(winner, loser) {
		for(var i = 0; i < loser.ships.length; i++) {
				if(loser.ships[i].length != 0) {
					return false;
				}
		}
		console.log(winner.name + ' Won');
		return true;
	}
}

//Starting the game
var game = new Game()
game.gameLoop();
