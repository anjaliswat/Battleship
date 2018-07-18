const readline = require('readline');
const readlineSync = require('readline-sync');

class Board {
	constructor(grid) {
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

class Player {
	constructor(name) {
		this.name = name;
		this.ships = [];
		this.hits = [];
		this.misses = [];
	}
}

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

		var player1ShipsGrid = this.displayShips(player1, grid);
		var player2ShipsGrid = this.displayShips(player2, grid);

		var winner = false;
		while (winner != true) {
			this.beginTurn();
			console.log(player1ShipsGrid);
			this.displayAttacks(player1, player2, grid);
			this.playerMove(player1, player2, grid);
			winner = this.checkForWinner(player2);
			if(winner == true) {
				return
			}
			this.displayAttacks(player1, player2, grid);
			this.endTurn();

			this.beginTurn();
			console.log(player2ShipsGrid)
			this.displayAttacks(player2, player1, grid );
			this.playerMove(player2, player1, grid);
			winner = this.checkForWinner(player1);
			this.displayAttacks(player2, player1, grid);
			this.endTurn();
		}
	}

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

	beginTurn() {
    if(readlineSync.keyInYN('Are you ready to start your turn? :')) {
      return
    }
    else {
      this.beginTurn()
    }
	}

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

	checkIfOccupied(option, player) {
		for(var i = 0;i < player.ships.length; i++){
			for(var j = 0;j < option.length; j++) {
				if(player.ships[i].includes(option[j])) {
					return true;
				}
			}
		}
		return false;
	}

	validateSelectedOption(selectedOption, dict) {
	  if(selectedOption < dict.length) {
	    return true
	  }
	  else{
	    return false
	  }
	}

	playerMove(playerAttacking, playerUnderAttack, grid) {
		var valid = false;
		var sinkingShip = 0;
		var move = readlineSync.question(playerAttacking.name + ' Enter a location : ').toUpperCase();
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

	displayOptions(loc, ship, player, grid) {
		for(var i = 0; i < grid.length; i++) {
			for(var j = 0; j < grid[i].length; j++) {
				if(loc == grid[i][j]) {
						ship.xpos = i;
						ship.ypos = j;
					}
				}
			}
		//horizontal
    var option1 = [];
		var i = ship.ypos;
		for(var j = 0; j < ship.size; j++) {
			if(i < grid[0].length) {
				option1.push(grid[ship.xpos][ship.ypos+j]);
				i = i + 1;
			}
		}

    var option2 = [];
		i = ship.ypos;
		for(var j = 0; j < ship.size; j++) {
			if(i >= 0) {
				option2.push(grid[ship.xpos][ship.ypos-j]);
				i = i - 1;
			}
		}
		//vertical
    var option3 = [];
		i = ship.xpos;
		for(var j = 0; j < ship.size; j++) {
			if(i < grid.length) {
				option3.push(grid[ship.xpos+j][ship.ypos]);
				i = i + 1;
			}
		}
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

	displayShips(player, grid) {
		var board = new Board();
		var shipsGrid = board.grid;

		for(var i = 0;i < shipsGrid.length; i++) {
			for(var j = 0;j < shipsGrid[i].length; j++) {
				for(var k = 0;k < player.ships.length; k++){
					if(player.ships[k].includes(grid[i][j]))
						shipsGrid[i][j] = ' S'
				}
			}
		}
		return(shipsGrid);
	}

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
		console.log("THIS GRID SHOWS THE LOCATION OF YOUR ATTACKS, MISSES AND THE OPPONENTS ATTACKS")
		console.log(attacksGrid);
	}

	endTurn() {
    if(readlineSync.keyInYN('Do you want to end you turn :')) {
      console.clear();
    }
    else {
      this.endTurn();
    }
	}

	checkForWinner(player) {
		var winner = true;
		for(var i = 0; i < player.ships.length; i++) {
				if(player.ships[i].length == 0) {
					winner = true;
				}
				else {
					return false;
				}
		}
		if(winner == true) {
			console.log(player.name + "Won");
		}
		return true;
	}
}

var game = new Game()
game.gameLoop();
