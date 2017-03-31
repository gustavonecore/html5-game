document.body.addEventListener("keydown", function(e)
{
	keys[e.keyCode] = true;
});

document.body.addEventListener("keyup", function(e)
{
	keys[e.keyCode] = false;
});


function Sprite(options)
{
	this.image = options.imageRight;
	this.width = options.width;
	this.height = options.height;
	this.nFrames = options.nFrames;
	this.imageLeft = options.imageLeft;
	this.imageRight = options.imageRight;
	this.frameIndex = 0;
	this.tickCount = 0;
	this.ticksPerFrame = 4;
	this.isMoving = false;
	this.x = width/2;
	this.y = height - options.imageRight.height;
	this.speed = 3;
	this.velX = 0;
	this.velY = 0;
	this.direction = 'right';
	this.jumping = false;

	this.moveRight = function()
	{
		if (this.velX < this.speed)
		{
			this.velX++;

			this.isMoving = true;

			this.image = this.imageRight;

			this.direction = 'right';
		}
	}

	this.moveLeft = function()
	{
		if (this.velX > -this.speed)
		{
			this.velX--;

			this.isMoving = true;

			this.image = this.imageLeft;

			this.direction = 'left';
		}
	}

	this.jump = function()
	{
		if (!this.jumping)
		{
			this.jumping = true;
			this.velY = -this.speed*2;
		}
	}

	this.move = function()
	{
		this.isMoving = false;

		if (keys[KEY_RIGHT] && (keys[KEY_UP1] || keys[KEY_UP2]))
		{
			this.moveRight();
			this.jump();
		}
		else if (keys[KEY_LEFT] && (keys[KEY_UP1] || keys[KEY_UP2]))
		{
			this.moveLeft();
			this.jump();
		}
		else if (keys[KEY_UP1] || keys[KEY_UP2])
		{
			this.jump();
		}
		else if (keys[KEY_RIGHT])
		{
			this.moveRight();
		}
		else if (keys[KEY_LEFT])
		{
			this.moveLeft();
		}

		this.velX *= friction;
		this.velY += gravity;

		this.x += this.velX;
		this.y += this.velY;

		if (this.x >= width-this.width)
		{
			this.x = width-this.width;
		}
		else if (this.x <= 0)
		{
			this.x = 0;
		}

		if(this.y >= height-this.height)
		{
			this.y = height - this.height;
			this.jumping = false;
		}
	}

	this.update = function ()
	{
		if (!this.jumping && this.isMoving)
		{
			this.tickCount++;

			// Start again the stripe
			if (this.frameIndex === this.nFrames -1)
			{
				this.frameIndex = 0;
			}

			if (this.tickCount > this.ticksPerFrame)
			{
				this.tickCount = 0;

				if (this.frameIndex < this.nFrames - 1)
				{
					this.frameIndex++;
				}
			}
		}
	};

	this.render = function()
	{
		var sourceX;

		if (this.direction === 'right')
		{
			sourceX = this.frameIndex * this.width;
		}
		else
		{
			sourceX = (this.width * this.nFrames - this.width) - this.frameIndex * this.width;
		}

		// Draw the animation
		ctx.drawImage(
			this.image,
			sourceX,
			0,
			this.width,
			this.height,
			this.x,
			this.y,
			this.width,
			this.height
		);
	};
}


const KEY_LEFT = 37;
const KEY_UP1 = 38;
const KEY_UP2 = 32;
const KEY_RIGHT = 39;
const KEY_DOWN = 40;

const friction = 0.8;
const gravity = 0.3;

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var width = window.screen.width;
var height = window.screen.height - 300;

var playerFrames = 6;
var keys = [];
canvas.width = width;
canvas.height = height;

var spritePlayer = null;
var playerImage = new Image();
var playerImageLeft = new Image();

playerImage.onload = function()
{
	playerImageLeft.onload = function()
	{
		spritePlayer = new Sprite(
		{
			context: ctx,
			width: playerImage.width/playerFrames,
			height: playerImage.height,
			imageLeft: playerImageLeft,
			imageRight: playerImage,
			nFrames: playerFrames
		});

		spritePlayer.isMoving = false;

		update();
	}
};
playerImage.src = "img/sprite.png";
playerImageLeft.src = "img/sprite-left.png";

function update()
{
	ctx.clearRect(0,0,width,height);

	spritePlayer.move();

	spritePlayer.update();

	spritePlayer.render();

	requestAnimationFrame(update);
}

