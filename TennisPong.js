var canvas;
var convasContext;
var ballX=50;
var ballY=50;
var ballSpeedX = 7;
var ballSpeedY = 4;
var player1Score =0;
var player2Score =0;
var winningScore =10;

var showWinScreen = false;

var paddle1Y = 210;
var paddle2Y = 210;
const paddleHeight = 100;
const paddleThickness = 10;

function calcMousePos(evt) 
{
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return {
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt)
{
	if(showWinScreen)
	{
		player1Score =0;
		player2Score =0;
		showWinScreen = false;
	}
}

window.onload = function()
{
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
			moveEverything();
			drawEverything();	
		}, 1000/framesPerSecond);

	canvas.addEventListener('mousedown',handleMouseClick);

	canvas.addEventListener('mousemove',
		function(evt) {
			var mousePos = calcMousePos(evt);
			paddle1Y = mousePos.y - (paddleHeight/2);
		});
}

function ballReset()
{
	if(player1Score >= winningScore || player2Score >= winningScore)
	{
		showWinScreen = true;
	}
	
	ballSpeedX = -ballSpeedX;
	ballX=canvas.width/2;
	ballY=canvas.height/2;
}

function compMovement()
{
	var paddle2YCenter = paddle2Y + (paddleHeight/2);
	if(paddle2YCenter < ballY-35)
	{
		paddle2Y = paddle2Y + 6;
	}
	else if(paddle2YCenter > ballY+35)
	{
		paddle2Y = paddle2Y - 6;
	}		
}

function moveEverything()
{
	if(showWinScreen)
	{
		return;
	}
	
	compMovement();

	ballX = ballX + ballSpeedX;
	ballY = ballY + ballSpeedY;

	if(ballX < 0){
		if(ballY > paddle1Y && ballY < paddle1Y + paddleHeight)	{
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle1Y+paddleHeight/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score += 1; //must be before ball reset()
			ballReset();
		}
	}
	if(ballX > canvas.width)
	{
		if(ballY > paddle2Y && ballY < paddle2Y + paddleHeight)	{
			ballSpeedX = -ballSpeedX;
			var deltaY = ballY - (paddle2Y+paddleHeight/2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++; //must be before ball reset()
			ballReset();
		}
	}
	if(ballY < 0)
	{
		ballSpeedY = -ballSpeedY;
	}
	if(ballY > canvas.height)
	{
		ballSpeedY = -ballSpeedY;
	}
	
}

function drawNet()
{
	for(var i=0; i < canvas.height; i+=40)
	{	
		colorRect(canvas.width/2-1,i,2,20,'white')
	}
}

function drawEverything()
{
	//this is for black background
	colorRect(0,0,canvas.width,canvas.height,'green');
	
	if(showWinScreen)
	{
		canvasContext.fillStyle = 'white';

		if(player1Score >= winningScore) 
		{
			canvasContext.fillText("Left Player Won", 310, 100);
		} 
		else if(player2Score >= winningScore)
		{
			canvasContext.fillText("Right Player Won", 310, 100);
		}

		canvasContext.fillText("Click to play", 320, 300);
		return;
	}
	drawNet();

	//this is for left white player paddle
	colorRect(0,paddle1Y,paddleThickness,paddleHeight,'white');

	//this is for right white computer paddle
	colorRect(canvas.width-paddleThickness,paddle2Y,paddleThickness,paddleHeight,'white');

	//this is for white ball
	colorCircle(ballX,ballY,7,'white');

	canvasContext.fillText(player1Score, 100,100);
	canvasContext.fillText(player2Score, canvas.width-100,100);
}

function colorCircle(centerX, centerY, radius,drawColor)
{
	//this is for white ball
	canvasContext.fillStyle = drawColor;
	canvasContext.beginPath();
	canvasContext.arc(centerX,centerY,radius,0,Math.PI*2,true);
	canvasContext.fill();
}


function colorRect(leftX,topY,width,height,drawColor)
{
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY,width,height);
}
