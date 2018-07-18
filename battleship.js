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
	constructor(name, ships, hits, misses) {
		this.name = '';
		this.ships = [];
		this.hits = [];
		this.misses = [];
	}
}

class Ship {
	constructor(size){
		this.name = '';
		this.value = [];
		this.xpos = '';
		this.ypos = '';
		this.size = size;
	}
}

function Game() {
	var b = new Board();
	var grid = b.grid;

	var player1 = new Player();
	player1.name = "Player 1";
	var player2 = new Player();
	player2.name = "Player 2";

	this.gameLoop = function () {
		console.log(grid);

		var carrier1 = new Ship(5);
		this.placeShip(carrier1, player1)
		var battleship1 = new Ship(4);
		this.placeShip(battleship1, player1)
		var cruiser1 = new Ship(3);
		this.placeShip(cruiser1, player1)
		var submarine1 = new Ship(3);
		this.placeShip(submarine1, player1)
		var destroyer1 = new Ship(2);
		this.placeShip(destroyer1, player1)
		console.clear();

		var carrier2 = new Ship(5);
		this.placeShip(carrier2, player2)
		var battleship2 = new Ship(4);
		this.placeShip(battleship2, player2)
		var cruiser2 = new Ship(3);
		this.placeShip(cruiser2, player2)
		var submarine2 = new Ship(3);
		this.placeShip(submarine2, player2)
		var destroyer2 = new Ship(2);
		this.placeShip(destroyer2, player2)
		console.clear();

		player1ShipsGrid = this.displayShips(player1);
		player2ShipsGrid = this.displayShips(player2);

		winner = false;
		while (winner != true) {
			this.beginTurn();
			console.log(player1ShipsGrid);
			this.displayAttacks(player1, player1, player2);
			this.playerMove(carrier2, battleship2, cruiser2, submarine2, destroyer2, player1);
			winner = this.checkForWinner(player1);
			if(winner == true) {
				return
			}
			this.displayAttacks(player1, player1, player2);
			this.endTurn();

			this.beginTurn();
			console.log(player2ShipsGrid)
			this.displayAttacks(player2, player1, player2);
			this.playerMove(carrier1, battleship1, cruiser1, submarine1, destroyer1, player2);
			winner = this.checkForWinner(player2);
			this.displayAttacks(player2, player1, player2);
			this.endTurn();
		}
	}

	this.placeShip = function(ship, player) {
		loc = readlineSync.question(player.name + 'Enter start location for Carrier(Size = 5) : ').toUpperCase();
		valid = this.checkIfOnGrid(loc);
		while(valid != true) {
			loc = readlineSync.question('This is not a valid input. Please enter a different location :').toUpperCase();
			valid = this.checkIfOnGrid(loc);
		}
		op = this.displayOptions(loc, ship, player);
		while(op == false) {
			loc = readlineSync.question('This ship is overlapping with another ship. Try entering a different location!').toUpperCase();
			op = this.displayOptions(loc, ship, player);
		}
		ship.value = op;
		player.ships.push(ship.value);
	}

	this.beginTurn = function() {
		beginturn = ''
		while(beginturn != 'Y') {
			beginturn = readlineSync.question('Are you ready to start your turn? Enter "Y" to begin :').toUpperCase();
		}
	}

	this.checkIfOnGrid = function(loc) {
		valid = false;
	  for(i = 0; i < grid.length; i++) {
	    for(j = 0; j < grid[i].length; j++) {
	      if(loc == grid[i][j]) {
	          valid = true;
	        }
	      }
	    }
		return valid;
	}

	this.checkIfOccupied = function(option, player) {
		occupied = false;
		for(i = 0;i < player.ships.length; i++){
			for(j = 0;j < option.length; j++) {
				if(player.ships[i].includes(option[j])) {
					occupied = true;
				}
			}
		}
		return occupied;
	}

	this.validateSelectedOption = function(selectedOption, dict) {
	  if(selectedOption < dict.length) {
	    return true
	  }
	  else{
	    return false
	  }
	}

	this.playerMove = function(carrier, battleship, cruiser, submarine, destroyer, player) {
		var valid = false;
		var sinkingShip = 0;
		var move = readlineSync.question(player.name + ' Enter a location : ').toUpperCase();
		for (row = 0; row < grid.length; row++) {
			if (grid[row].includes(move) == true) {
				valid = true;
			}
		}
		if (valid == true) {
			if (player.hits.includes(move) == true || player.misses.includes(move) == true) {
				console.log('Already Taken');
			}
			for(i = 0;i < player.ships.length;i++) {
				if(player.ships[i].includes(move)) {
					console.log('Hit');
					player.ships[i].splice(player.ships[i].indexOf(move), 1 );
					player.hits.push(move);
					if(player.ships[i].length == 0) {
						console.log('Sunk');
						return;
					}
					return;
				}
			}
				console.log('Miss');
				player.misses.push(move);
				return;
		}
	}

	this.displayOptions = function(loc, ship, player) {
		for(i = 0; i < grid.length; i++) {
			for(j = 0; j < grid[i].length; j++) {
				if(loc == grid[i][j]) {
						ship.xpos = i;
						ship.ypos = j;
					}
				}
			}
		options = [];
		option1 = [];
		option2 = [];
		option3 = [];
		option4 = [];
		//horizontal
		i = ship.ypos;
		for(j = 0; j < ship.size; j++) {
			if(i < grid[0].length) {
				option1.push(grid[ship.xpos][ship.ypos+j]);
				i = i + 1;
			}
		}

		i = ship.ypos;
		for(j = 0; j < ship.size; j++) {
			if(i >= 0) {
				option2.push(grid[ship.xpos][ship.ypos-j]);
				i = i - 1;
			}
		}
		//vertical
		i = ship.xpos;
		for(j = 0; j < ship.size; j++) {
			if(i < grid.length) {
				option3.push(grid[ship.xpos+j][ship.ypos]);
				i = i + 1;
			}
		}

		i = ship.xpos;
		for(j = 0; j < ship.size; j++) {
			if(i >= 0) {
				option4.push(grid[ship.xpos-j][ship.ypos]);
				i = i - 1;
			}
		}

		occupied1 = this.checkIfOccupied(option1, player);
		if(occupied1 == false) {
			options.push(option1)
		}
		occupied2 = this.checkIfOccupied(option2, player);
		if(occupied2 == false) {
			options.push(option2)
		}
		occupied3 = this.checkIfOccupied(option3, player);
		if(occupied3 == false) {
			options.push(option3)
		}
		occupied4 = this.checkIfOccupied(option4, player);
		if(occupied4 == false) {
			options.push(option4)
		}



		console.log(options);
		if(options.length != 0) {
			var dict = [];
			j = 0;
			for(i = 0; i < options.length; i++) {
				if(options[i].length == ship.size) {
					dict.push({
						key: j,
						value: options[i]
					});
					console.log(j + ': ' + options[i]);
					j = j + 1;
				}
			}
			selectedOption = readlineSync.question('Enter an option :');
			valid = this.validateSelectedOption(selectedOption, dict)

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

	this.displayShips = function(player) {
		var board = new Board();
		var shipsGrid = board.grid;

		for(i = 0;i < shipsGrid.length; i++) {
			for(j = 0;j < shipsGrid[i].length; j++) {
				for(k = 0;k < player.ships.length; k++){
					if(player.ships[k].includes(grid[i][j]))
						shipsGrid[i][j] = ' S'
				}
			}
		}

		return(shipsGrid);
	}

	this.displayAttacks = function(player, player1, player2) {
		var board = new Board();
		var attacksGrid = board.grid;

		for(i = 0;i < attacksGrid.length; i++) {
			for(j = 0;j < attacksGrid[i].length; j++) {
				if(player.name == 'Player 1') {
					if(player1.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P1H'
					}
					else if(player2.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P2H'
					}
				}
					if(player2.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P2H'
					}
					else if(player1.hits.includes(grid[i][j])) {
						attacksGrid[i][j] = 'P1H'
					}
				if(player.misses.includes(grid[i][j])) {
					attacksGrid[i][j] = ' M'
				}
			}
		}
		console.log("THIS GRID SHOWS THE LOCATION OF YOUR ATTACKS, MISSES AND THE OPPONENTS ATTACKS")
		console.log(attacksGrid);
	}

	this.endTurn = function() {
		endturn = ''
		while(endturn != 'N') {
			endturn = readlineSync.question('Your turn has ended. Press "n" to let the next player start their turn.').toUpperCase();
		}
		console.clear();
	}

	this.checkForWinner = function(player) {
		winner = true;
		for(i = 0;i < player.ships.length; i++) {
				if(player.ships[i].length == 0) {
					winner = true
				}
				else {
					winner = false
					return winner;
				}
		}
		if(winner == true) {
			console.log(player.name + "Won")
		}
		return winner;
	}

}

var game = new Game()
game.gameLoop();
