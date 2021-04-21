var myBackground;
var myGamePiece;
var myObstacles = [];
var myScore;

function startGame() {
    myGamePiece = new component(50, 50, "media/running-monster.png", 0, 225, "image");
    myBackground = new component(700, 550, "media/background.jpg", 0, 0, "background");
    myScore = new component("30px", "Consolas", "White", 280, 40, "text");
    myGameArea.start();
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = 700;
        this.canvas.height = 550;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.frameNo = 0;
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = true;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = false;
        })
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    if (type == "image" || type == "background") {
        this.image = new Image();
        this.image.src = color;
    }
    this.width = width;
    this.height = height;
    this.speedX = 0;
    this.speedY = 0;
    this.x = x;
    this.y = y;
    this.update = function () {
        ctx = myGameArea.context;
        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width, this.height);
        }
        else if (type == "background") {
            ctx.drawImage(this.image, this.x + this.width, this.y, this.width, this.height);
        }
        else if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.type == "background") {
            if (this.x == -(this.width)) {
                this.x = 0;
            }
        }
    }
    this.crashWith = function (otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }
}

function everyInterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) { return true; }
    return false;
}


function updateGameArea() {
    var x, height, gap, minHeight, maxHeight, minGap, maxGap;
    for (i = 0; i < myObstacles.length; i += 1) {
        if (myGamePiece.crashWith(myObstacles[i])) {
            myGameArea.stop();
            myGameArea.clear();
            myBackground.newPos();
            myBackground.update();
            myScore.text = "SCORE: " + myGameArea.frameNo;
            myScore.update();
            return;
        }
    }
    myGameArea.clear();
    //replace 0 with -1 to get a moving background
    myBackground.speedX = 0;
    myBackground.newPos();
    myBackground.update();

    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyInterval(110)) {
        x = myGameArea.canvas.width;
        minHeight = 50;
        maxHeight = 500;
        height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
        minGap = 125;
        maxGap = 250;
        gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
        myObstacles.push(new component(40, height, "indianred", x, 0));
        myObstacles.push(new component(40, x - height - gap, "indianred", x, height + gap));
    }
    for (i = 0; i < myObstacles.length; i += 1) {
        myObstacles[i].x += -3;
        myObstacles[i].update();
    }

    myScore.text = "SCORE: " + myGameArea.frameNo;
    myScore.update();

    myGamePiece.speedX = 0;
    myGamePiece.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) { myGamePiece.speedX = -2; }
    if (myGameArea.keys && myGameArea.keys[39]) { myGamePiece.speedX = 2; }
    if (myGameArea.keys && myGameArea.keys[38]) { myGamePiece.speedY = -3; }
    if (myGameArea.keys && myGameArea.keys[40]) { myGamePiece.speedY = 3; }
    myGamePiece.newPos();
    myGamePiece.update();
}

