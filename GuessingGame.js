function generateWinningNumber(){
	min = Math.ceil(1);
	//returns the smallest integer greater than or equal to a given number
	//rounds up
	max = Math.floor(100);
	//returns the largest integer less than or equal to a given number.
	//rounds down
	return Math.floor(Math.random() * (max-min+1)) + min;
}

function shuffle(array){
	var m = array.length, t, i;

	while(m){
		i = Math.floor(Math.random() * m--);

		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
}

function Game(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
}

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess-this.winningNumber);
}
Game.prototype.isLower = function(){
	if(this.playersGuess < this.winningNumber){
		return true;
	} else {
		return false;
	}
}
Game.prototype.playersGuessSubmission = function(num){
	if(num < 1 || num > 100 || typeof num !== 'number'){
		return "That is an invalid guess." 
	}
	this.playersGuess = num;
	return 	this.checkGuess(this.playersGuess);
}

Game.prototype.checkGuess = function(){
	if(this.playersGuess == this.winningNumber){
		$('#subtitle').text('Click Reset to play again.');
		$('#hint, #submit').prop("disabled", true);
		return "You Win!";

	} else if(this.pastGuesses.includes(this.playersGuess)){
		return "You have already guessed that number.";
	} else {
		this.pastGuesses.push(this.playersGuess);
		$('#guess-list li:nth-child(' + this.pastGuesses.length + ')').text(this.playersGuess);
		
		if(this.pastGuesses.length == 5){
			$('#subtitle').text('Click Reset to play again.');
			$('#hint, #submit').prop("disabled",true);
			return "You Lose. The winning number was " + this.winningNumber;
		}
		else {
			if(this.isLower()){
				$('#subtitle').text('Guess higher');
			} else {
				$('#subtitle').text('Guess lower');
			}

			if(this.difference() < 10){
				return "You\'re burning up!";
			} else if(this.difference() < 25){
				return "You\'re lukewarm.";
			} else if(this.difference() < 50){
				return "You\'re a bit chilly.";
			} else if(this.difference() < 100){
				return "You\'re ice cold!";
			}
		}
	}
}




function newGame(){
	return new Game();
}

Game.prototype.provideHint = function(){
	var hintArray = [];
	hintArray.push(this.winningNumber);
	hintArray.push(generateWinningNumber())
	hintArray.push(generateWinningNumber());
	shuffle(hintArray);
	return hintArray;
}

function makeAGuess(game){
	var guess = $('#players-input').val();
	$('#players-input').val('');
	var output = game.playersGuessSubmission(parseInt(guess,10));
	$('#title').text(output);
}

jQuery(document).ready(function(){
	var game = new Game();

	$('#submit').on('click', function(){
		makeAGuess(game);
	})
	$('#players-input').on('keypress', function(){
		if(event.which == 13){
			makeAGuess(game);
		}
	})

	$('#hint').on('click', function(){
		var hintArray = game.provideHint();
		$('#title').text('The winning number is either ' + hintArray[0] + ', ' + hintArray[1] + ', or ' + hintArray[2]);
	})

	$('#reset').on('click', function(){
		game = newGame();
		$('#title').text('Play the Guessing Game!');
		$('#subtitle').text('Guess a number between 1-100!');
		$('.guess').text('-');
		$('#hint, #submit').prop("disabled", false);
	})



})



