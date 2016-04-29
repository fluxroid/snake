window.onload = function()
{
	var canvas = document.createElement("canvas");
	var context = canvas.getContext("2d");
	var score = 0;
	var direction = 0;
	var snake = new Array(3);
	var level = 1;
	var active = false; 
	var map = new Array(35);
	var speed = 100;
	var start = false;
	var dead = false;
	for (var i = 0; i<map.length; i++){
		map[i] = new Array(21);
	}

	canvas.width = 704;
	canvas.height = 424;

	var body = document.getElementsByTagName('body')[0];
	body.appendChild(canvas);

	map = generateSnake(map);
	map = generateFood(map);

	drawGame();
	window.addEventListener('keydown', function(e) {
	if ([38, 40, 37, 39].indexOf(e.keyCode) !== -1 && !dead){
		start = true;
		if (e.keyCode === 38 && direction !== 3) {
		direction = 2; //up
	}
	else if (e.keyCode === 40 && direction !==2) {
		direction = 3; //down
	}
	else if (e.keyCode === 37 && direction !==0) {
		direction = 1; // left
	}
	else if (e.keyCode === 39 && direction !==1) {
		direction = 0;
	}
	}
	else if (e.keyCode === 13 && dead){
		restart();
	}
});

	function drawGame(){
		context.clearRect(0, 0, canvas.width, canvas.height)
		if (start){
		for (var i = snake.length -1; i >= 0; i--){

			if (i === 0){
				switch(direction){
		 			case 0: //right
		 			snake[0] = {x: snake[0].x + 1, y: snake[0].y}
		 			break;
		 			case 1: //left
		 			snake[0] = {x: snake[0].x - 1, y: snake[0].y}
		 			break;
		 			case 2: //up
		 			snake[0] = {x: snake[0].x, y: snake[0].y-1}
		 			break;
		 			case 3: //down
		 			snake[0] = {x: snake[0].x, y: snake[0].y+1}
		 			break;
		 		}
		 		if (snake[0].x < 0 || snake[0].x >= 35 || snake[0].y <= 0 || snake[0].y >=21){
		 			showGameover();
		 			dead = true;
		 			start = false;
		 			return;
		 		}

		 		if (map[snake[0].x][snake[0].y] === 1) {	
		 			score+=50;
		 			map = generateFood(map);
		 			snake.push({x:snake[snake.length -1].x, y:snake[snake.length - 1].y});
		 			map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;
		 		}
		 		
		 		else if (map[snake[0].x][snake[0].y] === 2) {
		 			showGameover();
		 			dead = true;
		 			start = false;
		 			return;
		 		}
		 		map[snake[0].x][snake[0].y] = 2;
		 	}
		 	else {
		 		if (i === (snake.length-1)) {
		 			map[snake[i].x][snake[i].y] = null;
		 		}
		 		snake[i] = {x: snake[i-1].x, y: snake[i-1].y};
		 		map[snake[i].x][snake[i].y] = 2;
		 	}	
		 }
		 drawMain();			
		 for (var x = 0; x < map.length; x++){
		 	for (var y = 0; y<map[0].length; y++){
		 		if (map[x][y] === 1){
		 			context.fillStyle = "blue";
		 			context.fillRect(x * 20, y * 20, 20, 20);
		 		}else if (map[x][y] === 2){
		 			context.fillStyle = "black";
		 			context.fillRect(x * 20, y * 20, 20, 20);
		 		}

		 	}	
		 }
	}
	 else {
		 	drawStart();
		 	active = true;
		 }

		 if (active){
		 	setTimeout(drawGame, speed - (level * 7));
		 }
		 increaseLevel();
	

}

		function drawStart(){
			drawBorder();
			context.fillStyle = "black";
			context.font = "26px sans-serif";
			context.fillText("Snake!", ((canvas.width / 2) - (context.measureText("Snake!").width / 2)), 110);
			context.font = "16px sans-serif";
			context.fillText("Press Any Arrow Key To Start", ((canvas.width / 2) - 
				(context.measureText("Press Any Arror Key To Start").width / 2)), 
			150);
		}

		function drawBorder(){
			context.clearRect(0,0,canvas.width,canvas.height);
			context.lineWidth = 2;
			context.strokeStyle = "black";
			context.strokeRect(0, 20, canvas.width - 4, canvas.height - 24);
		}

		function drawMain(){
			drawBorder();
			context.font = "12px sans-serif";
			context.fillStyle = "black";
			context.fillText("Score: " + score, 2, 12);
			context.fillText("Level: " + level, 80, 12);
			context.stroke();
}


		function generateFood(map){
			var randomX = Math.floor(Math.random() * 35);
			var randomY = Math.floor(Math.random() * 20) + 1;
			
			while (map[randomX][randomY] === 2){
				randomX = Math.floor(Math.random() * 35);
				randomY = Math.floor(Math.random() * 20) + 1;
			}
			map[randomX][randomY] = 1;
			return map;
		}

		function generateSnake(map){
			var px = 17;
			var py = 9;
			for (var i = 0; i < snake.length; i++){
				snake[i]= {x: px-i, y: py };
				map[px - i][py] = 2;
			}
			return map;
		}

		function increaseLevel(){
			if (score / level === 100 && level <15){
				level ++;
			} 
		}

		function showGameover(){
			context.clearRect(0,0,canvas.width,canvas.height);
			context.fillStyle = "black";
			context.font = "40px sans-serif";
			context.fillText("GAME OVER!", 
				((canvas.width / 2) - (context.measureText("GAME OVER!").width / 2)), 100);
			context.font = "30px sans-serif";
			context.fillText("YOUR SCORE WAS: " + score, 
				((canvas.width / 2) - (context.measureText("YOUR SCORE WAS: ").width / 2)) - 15, 140);
			context.font = "25px sans-serif";
			context.fillText("PRESS ENTER TO PLAY AGAIN", 
				((canvas.width /2) - (context.measureText("PRESS ENTER TO PLAY AGAIN").width /2)), 175);
		}
		function restart (){
			score = 0;
			direction = 0;
			snake = new Array(3);
			level = 1;
			active = false; 
			speed = 100;
			dead = false
			map = new Array(35);
			for (var i = 0; i<map.length; i++){
				map[i] = new Array(21);
			}
			map = generateSnake(map);
			map = generateFood(map);
			drawGame();

		}

};
