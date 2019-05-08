var canvas = document.getElementById('canvas');
var context = canvas.getContext("2d");
var shape;
var board;
var score;
var pac_color;
var start_time;
var time_elapsed;
var end_game;
var interval;
var monsters;
var badGuys;
var red;
var black;
var green;
var maxScore;
var bonus_dude;
var timeBunus;
var boardSize = 17;
var bonusExists;
var end_game_reason;
var pacmanlife;
//user input:
var user_keys = {'up':'ArrowUp', 'down':'ArrowDown', 'right': 'ArrowRight', 'left': 'ArrowLeft'};
var numOfMonsters = 1;
var timerLimit;
var food_remain;
var col1 = document.getElementById('color1');
var col2 = document.getElementById('color2');
var col3 = document.getElementById('color3');
var audio;
var blockSize = 30;




var pacDirection = "right";
var settings;


document.getElementById('upKey').addEventListener('keyup', function (e) {
    if(e.keyCode == 9 || e.keyCode == 27){
        return;
    }
    user_keys['up'] = e.code;
    document.getElementById("upKey").value = e.code;
});
document.getElementById('rightKey').addEventListener('keyup', function (e) {
    if(e.keyCode == 9 || e.keyCode == 27){
        return;
    }
    user_keys['right'] = e.code;
    document.getElementById("rightKey").value = e.code;
});
document.getElementById('downKey').addEventListener('keyup', function (e) {
    if(e.keyCode == 9 || e.keyCode == 27){
        return;
    }
    user_keys['down'] = e.code;
    document.getElementById("downKey").value = e.code;
});
document.getElementById('leftKey').addEventListener('keyup', function (e) {
    if(e.keyCode == 9 || e.keyCode == 27){
        return;
    }
    user_keys['left'] = e.code;
    document.getElementById("leftKey").value = e.code;
});



function restartPressed(){
    if(audio)
        audio.pause();
    console.log("*********"+window.clearInterval(interval));
    console.log("*********"+window.clearInterval(badGuys));
    Start();
}

function terminateGame() {
    if(audio)
        audio.pause();
    window.clearInterval(interval);
    window.clearInterval(badGuys);

}
function openSettings(){

    terminateGame();

    var form = document.getElementById('pacmanSetup');
    form.style.display = "block";

    var wrapper = document.getElementById('canvas-wrapper');
    wrapper.style.display = "none";

}
function setRandom(){

    var rfood =  document.getElementById('foodAmount');
    var rmonster = document.getElementById('monsters');
    var rtimer = document.getElementById('timer');
    rtimer.value = Math.floor(60 + Math.random()*120);
    rmonster.value = Math.floor(Math.random()*3 +1);
    rfood.value = Math.floor(50 + Math.random()*40);

    col1.value = getRandomColor();
    col2.value = getRandomColor();
    col3.value = getRandomColor();


    console.log("qqqq"+ col1.value);

}

function drawLives(num){
    var life_section = document.getElementById("lives");
    var child = life_section.lastElementChild;
    while (child) {
        life_section.removeChild(child);
        child = life_section.lastElementChild;
    }

    for(var i = 0 ; i < num;i++) {


        var newimg = document.createElement("img");

        newimg.setAttribute("src", "life.gif");
        newimg.setAttribute("id", i+"life");
        newimg.style.width = "60px";
        newimg.style.height = "60px";
        life_section.appendChild(newimg);
    }
}


function getRandomColor() {

    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function validate(){
    window.addEventListener("keydown", function(e) { //stop scrolling
        // space and arrow keys
        if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
            e.preventDefault();
        }
    }, false);

    // var canvasSheet = document.getElementById('canvas');
    // // canvasSheet.innerHTML.blink();


    var food =  document.getElementById('foodAmount').value;
    if(food < 50 || food > 90){
        alert("food amount must be a number between 50 - 90");
        return;
    }
    var monster = document.getElementById('monsters').value;
    if(monster < 1 || monster > 3 ){
        alert("monsters amount must be a number between 1 - 3");
        return;
    }
    var timer = document.getElementById('timer').value;
    if(timer < 60){
        alert("time limit must be at least 60 seconds");
        return;
    }



    var form = document.getElementById('pacmanSetup');
    form.style.display = "none";
    // settings = form.innerHTML;
    // form.innerHTML = "";

    var wrapper = document.getElementById('canvas-wrapper');
    wrapper.style.display = "block";


    food_remain = food;
    numOfMonsters = monster;
    timerLimit = timer;
    console.log("5="+ col1.value+", 10="+col2.value+", 15="+col3.value);

    Start();

}


function Start() {

    audio = new Audio('POL-lone-wolf-short.wav');
    audio.loop = true;
    audio.play();


    pacmanlife = 3;
    drawLives(pacmanlife);
    bonus_dude = new Object();
    monsters = new Array();
    shape = new Object();
    end_game_reason = "";
    end_game = false;
    bonusExists =true;
    board = new Array();
    var map =
        [
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,1,1,0,0,1,0,0,1,1,0,1,1,0,0],
            [0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,1,0,0,0,1,0,0,0,1,0,1,1,0,0],
            [0,0,0,1,1,1,0,1,0,0,0,1,0,1,1,1,0,0,0],
            [0,1,0,0,0,1,0,1,1,0,1,1,0,1,0,0,0,1,0],
            [0,0,0,1,0,0,0,1,0,0,0,1,0,0,0,1,0,0,0],
            [0,0,1,1,0,1,0,1,1,1,1,1,0,1,0,1,1,0,0],
            [0,0,0,1,0,1,0,0,0,0,0,0,0,1,0,1,0,0,0],
            [0,0,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,0,1,1,1,0,1,0,1,1,1,0,1,1,0,0],
            [0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
            [0,1,0,1,0,1,0,1,1,1,1,1,0,1,0,1,0,1,0],
            [0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,0],
            [0,0,1,1,1,1,1,1,0,1,0,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]



        ];
    console.log("map= "+ map.length);

    score = 0;
    pac_color = "yellow";
    var cnt = boardSize * boardSize;
    var pacman_remain = 1;
    red = parseInt(food_remain *0.3);
    black = parseInt(food_remain *0.6);
    green  = parseInt(food_remain *0.1);
    maxScore = (5*black + 15*red + 25*green);
    console.log("maxscore="+maxScore);
    console.log("red="+red+", green="+green+", black="+black+", all 50= "+(black+green+red));
    start_time = new Date();

    context.canvas.width = (boardSize + 2)*blockSize; // dynamic
    context.canvas.height = (boardSize + 2)*blockSize;


    for (var i = 0; i < boardSize + 2; i++) {
        board[i] = new Array();
        //put obstacles in (i=3,j=3) and (i=3,j=4) and (i=3,j=5), (i=6,j=1) and (i=6,j=2)
        for (var j = 0; j < boardSize + 2; j++) {
            if(i === 0 || j ===0 || i === boardSize + 1 || j === boardSize + 1){
                board[i][j] = 4
                continue;
            }

            if ( map[j][i] === 1) {
                board[i][j] = 4; //wall
            }

            else {
                var randomNum = Math.random();
                if (randomNum <= 1.0 * (green+black+red) / cnt) {
                    board[i][j] = chooseFood();
                }  else {
                    board[i][j] = 0;
                }
                cnt--;
            }
        }
    }


    while ((green+black+red) > 0) {
        var emptyCell = findRandomEmptyCell(board);
        board[emptyCell[0]][emptyCell[1]] = chooseFood();


    }

    console.log("remaining:  black="+black+", red="+red+", green="+green);
    if(!shape.i){
        var empty = findRandomEmptyCell(board);

        // board[empty[0]][empty[1]]= 2;
        shape.i=empty[0];
        shape.j=empty[1];
        board[shape.i][shape.j] = 2;
        // shape.i=0;
        // shape.j=2;

    }





    setMonsters();
    var bonus = findRandomEmptyCell(board);
    board[bonus[0]][bonus[1]]= 9;
    bonus_dude.i = bonus[0];
    bonus_dude.j = bonus[1];

    var extraTime = findRandomEmptyCell(board);
    board[extraTime[0]][extraTime[1]] = 12 // extra time bonus

    var extraLife = findRandomEmptyCell(board);
    board[extraLife[0]][extraLife[1]] = 13 // extra time bonus




    keysDown = {};
    addEventListener("keydown", function (e) {
        keysDown[e.code] = true;
    }, false);
    addEventListener("keyup", function (e) {
        keysDown[e.code] = false;
    }, false);
    // if(!interval)
    interval = setInterval(UpdatePosition, 100);

    badGuys = setInterval(updateBadGuys,600);


}
function chooseFood(){
    let rand = parseInt(Math.random()* 3); //num between 0-2
    if(rand === 0 ){
        if(black > 0){
            black--;
            return 1;
        }
    }
    if(rand === 1 ){
        if(red > 0){
            red--;
            return 3;

        }
    }
    if(rand === 2 ){
        if(green > 0){
            green--;
            return 6;
        }
    }
    // didnt work -  choose random
    if(black > 0){
        black--;
        return 1;
    }
    if(red > 0){
        red--;
        return 3;
    }
    if(green > 0){
        green--;
        return 6;
    }
    return 0;


}


function findRandomEmptyCell(board) {
    var i = Math.floor((Math.random() * boardSize) + 1);
    var j = Math.floor((Math.random() * boardSize) + 1);
    while (board[i][j] !== 0) {
        i = Math.floor((Math.random() * boardSize) + 1);
        j = Math.floor((Math.random() * boardSize) + 1);
    }
    return [i, j];
}

function setMonsters(){
    for(var i = 0; i < numOfMonsters; i++ ){ //initialize 4 monsters
        monsters[i] = new Object();

    }
    monsters[0].i = 1; // start positions
    monsters[0].j = 1;
    if(numOfMonsters >= 2) {
        monsters[1].i = boardSize;
        monsters[1].j = boardSize;
    }
    if(numOfMonsters >= 3) {
        monsters[2].i = 1;
        monsters[2].j = boardSize;
    }

    monsters.forEach(function (monster){
        monster.oldValue = board [monster.i][monster.j];
        board[monster.i][monster.j] = 5;
    })

}


/**
 * @return {number}
 */
function GetKeyPressed() {

    if (keysDown[user_keys['up']]) {
        pacDirection="up";

        return 1;
    }
    if (keysDown[user_keys['down']]) {
        pacDirection="down";
        return 2;
    }
    if (keysDown[user_keys['left']]) {
        pacDirection="left";
        return 3;
    }
    if (keysDown[user_keys['right']]) {
        pacDirection="right";
        return 4;
    }
}

function Draw() {

    context.clearRect(0, 0, canvas.width, canvas.height); //clean board
    lblScore.value = score;
    lblTime.value = time_elapsed;
    for (var i = 0; i < boardSize + 2; i++) {
        for (var j = 0; j < boardSize + 2; j++) {
            var center = new Object();
            center.x = i * blockSize + blockSize/2;
            center.y = j * blockSize + blockSize/2;
            // board[0][0]=5;
            if(board[i][j] === -1){
                this.image = new Image();
                this.image.src="redmon.png";
                context.drawImage(this.image,center.x-blockSize/2, center.y-blockSize/2, blockSize,blockSize);
            }
            else if (board[i][j] === 2) {


// right
                if(pacDirection==="right") {
                    context.beginPath();
                    context.arc(center.x, center.y, blockSize/2, 0.15 * Math.PI, 1.85 * Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + blockSize/12, center.y - blockSize/4, blockSize/10, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                }

                // left

                else if(pacDirection==="left") {
                    context.beginPath();
                    context.arc(center.x, center.y, blockSize/2, 0.15 * Math.PI + Math.PI, 1.85 * Math.PI + Math.PI); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + blockSize/12, center.y - blockSize/4, blockSize/10, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                }

                // down

                else if(pacDirection==="down") {
                    context.beginPath();
                    context.arc(center.x, center.y, blockSize/2, 0.15 * Math.PI + Math.PI / 2, 1.85 * Math.PI + Math.PI / 2); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + blockSize/6, center.y - blockSize/6, blockSize/10, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                }

                //up
                else if(pacDirection==="up") {
                    context.beginPath();
                    context.arc(center.x, center.y, blockSize/2, 0.15 * Math.PI + 3 * Math.PI / 2, 1.85 * Math.PI + 3 * Math.PI / 2); // half circle
                    context.lineTo(center.x, center.y);
                    context.fillStyle = pac_color; //color
                    context.fill();
                    context.beginPath();
                    context.arc(center.x + blockSize/6, center.y + blockSize/6, blockSize/10, 0, 2 * Math.PI); // circle
                    context.fillStyle = "black"; //color
                    context.fill();
                }


            } else if (board[i][j] === 1) {
                context.beginPath();
                context.arc(center.x, center.y, blockSize/4, 0, 2 * Math.PI+ Math.PI); // circle
                context.fillStyle = col1.value; //color
                context.fill();
                context.beginPath();
                var px = blockSize/3;
                context.font = px+'px Arial';

                context.fillStyle = "black"; //color
                context.fillText("5",center.x - blockSize/10 ,center.y + blockSize/10);


            } else if (board[i][j] === 3) {
                context.beginPath();
                context.arc(center.x, center.y, blockSize/4, 0, 2 * Math.PI); // circle
                context.fillStyle = col2.value; //color
                context.fill();

                context.beginPath();

                context.font = blockSize/3+'px Arial';

                context.fillStyle = "black"; //color
                context.fillText("15",center.x - blockSize/6,center.y + blockSize/12);
            } else if (board[i][j] === 6) {
                context.beginPath();
                context.arc(center.x, center.y, blockSize/4, 0, 2 * Math.PI); // circle
                context.fillStyle = col3.value; //color
                context.fill();

                context.beginPath();
                context.font = blockSize/3+'px Arial';

                context.fillStyle = "black"; //color
                context.fillText("25",center.x - blockSize/6 ,center.y + blockSize/12);
            } else if (board[i][j] === 4) {
                this.image = new Image();
                this.image.src="dark _wall.jpg";
                context.drawImage(this.image,center.x-blockSize/2, center.y-blockSize/2, blockSize,blockSize);
            }
            else if (board[i][j] === 5){
                this.image = new Image();
                this.image.src="redmon.png";
                context.drawImage(this.image,center.x-blockSize/2, center.y-blockSize/2, blockSize,blockSize);
            }
            else if ((board[i][j] === 9)){
                this.image = new Image();
                this.image.src="leprekon.png";
                context.drawImage(this.image,center.x-blockSize/2, center.y-blockSize/2, blockSize,blockSize);
            }
            else if ((board[i][j] === 12)){
                this.image = new Image();
                this.image.src="timeplus.png";
                context.drawImage(this.image,center.x-blockSize*3/8, center.y-blockSize*3/8, blockSize*3/4,blockSize*3/4);
            }
            else if ((board[i][j] === 13)){
                this.image = new Image();
                this.image.src="heart.png";
                context.drawImage(this.image,center.x-blockSize*3/8, center.y-blockSize*3/8, blockSize*3/4,blockSize*3/4);
            }
        }
    }



}

function UpdatePosition() {


    var x = GetKeyPressed();



        board[shape.i][shape.j] = 0;


    if (x === 1) {
        if (shape.j > 0 && board[shape.i][shape.j - 1] !== 4) {
            shape.j--;
        }
    }
    if (x === 2) {
        if (shape.j < boardSize && board[shape.i][shape.j + 1] !== 4) {
            shape.j++;
        }
    }
    if (x === 3) {
        if (shape.i > 0 && board[shape.i - 1][shape.j] !== 4) {
            shape.i--;
        }
    }
    if (x === 4) {
        if (shape.i < boardSize && board[shape.i + 1][shape.j] !== 4) {
            shape.i++;
        }
    }

    if(board[shape.i][shape.j] === 12){
        timerLimit = parseInt(timerLimit) + 10

    }

    if(board[shape.i][shape.j] === 13){
        pacmanlife++;
        drawLives(pacmanlife);

    }


    if (board[shape.i][shape.j] === 1) {
        var audio2 = new Audio('pacman_eatfruit.wav');
        audio2.play();
        score+=5;
    }
    if (board[shape.i][shape.j] === 3) {
        var audio2 = new Audio('pacman_eatfruit.wav');
        audio2.play();
        score+=15;
    }
    if (board[shape.i][shape.j] === 6) {
        var audio2 = new Audio('pacman_eatfruit.wav');
        audio2.play();
        score+=25;
    }
    if (board[shape.i][shape.j] === 9) {
        var audio2 = new Audio('pacman_eatfruit.wav');
        audio2.play();
        bonusExists = false;
        score+=50;
        if(bonus_dude.oldValue !== 0) {

            if (bonus_dude.oldValue === 1)
                score += 5
            if (bonus_dude.oldValue === 3)
                score += 15
            if (bonus_dude.oldValue === 6)
                score += 25;
        }
    }

    if(board[shape.i][shape.j] === 5) {
        end_game = true;
        end_game_reason = "YOU LOST!"
        board[shape.i][shape.j] = 0;
    }
    else
        board[shape.i][shape.j] = 2;

    var currentTime = new Date();
    time_elapsed = (currentTime - start_time) / 1000 ;
    if (score >= 100 && time_elapsed <= 10) {
        pac_color = "green";
    }
    time_elapsed = Math.floor((timerLimit - time_elapsed) *100) /100;
    if(time_elapsed <= 0){
        end_game =true;
        time_elapsed =0;
        if(score >= 150)
        end_game_reason = "WE HAVE A WINNER";
        else end_game_reason = "TOY CAN DO BETTER\n (score < 150)";

    }


    if(end_game && pacmanlife > 1){
        // window.clearInterval(interval);
        // window.clearInterval(badGuys);
        var audio3 = new Audio('pacman_death.wav');
        audio3.play();
        pacmanlife--;
        maxScore-=10;
        score-=10;

        drawLives(pacmanlife);
        setMonsters();
        // alert("you lost a life.\n"+ pacmanlife+" lives remaining");

        var empty = findRandomEmptyCell(board);
        shape.i=empty[0];
        shape.j=empty[1];

        end_game = false;
        // interval = setInterval(UpdatePosition, 100);
        // badGuys = setInterval(updateBadGuys,600);
        clearPacman();
        board[shape.i][shape.j] = 2;
        Draw;
        return;


    }



    if (score >= maxScore + 50 || end_game) {
        if(audio)
            audio.pause();

        console.log("*********"+window.clearInterval(interval));
        console.log("*********"+window.clearInterval(badGuys));
        Draw();
        if(score >= 150 && !end_game){
            new Audio("Ta Da-SoundBible.com-1884170640.mp3").play();
            window.alert("WE HAVE A WINNER");
        }
        else {
            var audio4 = new Audio('pacman_death.wav');
            audio4.play();
            window.alert(end_game_reason);
        }

        setTimeout(function() {
            console.log("timeout called");
        },1000)
        if(confirm("start a new game?")){
            Start();
            return;
        }
        else {openSettings();
        return;}

        // Start();

    } else {

        Draw();
    }
    return;
}

function updateBonusPosition(){
    let positions = getMonsterValidPositions(bonus_dude);
    var minDist = -1;
    var nextStep;
    positions.forEach(function (pos){
        if(minDist === -1 || pos.distance > minDist){
            minDist = pos.distance;
            nextStep = pos;
        }
    });
    if(nextStep){
        board[bonus_dude.i][bonus_dude.j] = bonus_dude.oldValue;
        bonus_dude.i= nextStep.i;
        bonus_dude.j=nextStep.j;
        bonus_dude.oldValue = board[bonus_dude.i][bonus_dude.j];
        board[bonus_dude.i][bonus_dude.j] = 9;

    }

}

function updateBadGuys(){
    if(bonusExists)
        updateBonusPosition();
    monsters.forEach(function (monster){
        let positions = getMonsterValidPositions(monster);
        var minDist = -1;
        var nextStep;
        positions.forEach(function (pos){
            if(minDist === -1 || pos.distance < minDist){
                minDist = pos.distance;
                nextStep = pos;
            }
        });
        if(nextStep)
            moveMonster(monster,nextStep); // change board and monster position
    })
}

function moveMonster(monster,nextPos) {
    if(monster.oldValue != 5)
        board[monster.i][monster.j] = monster.oldValue; // so that if two monters are on the sam espot./

    monster.i = nextPos.i;
    monster.j = nextPos.j;


    monster.oldValue = board[monster.i][monster.j];
    if(monster.oldValue===2)
        monster.oldValue=0;
    board[monster.i][monster.j] = 5;

    if(monster.i === shape.i && monster.j === shape.j) {
        if(!end_game) {
            end_game = true;
            end_game_reason = "YOU LOST!";
            board[shape.i][shape.j] = 0;
        }


    }
}

function getMonsterValidPositions(monster){
    var i = monster.i;
    var j = monster.j;
    var index = 0;
    var ans = new Array();
    var pos;
    //up
    if(j > 0 && (board[i][j-1] < 4 || board[i][j-1] === 6 || board[i][j-1] === 12 || board[i][j-1] === 13)){
        pos = new Object();
        pos.i = i;
        pos.j = j-1;
        pos.distance = getDistance(pos,shape);
        ans[index] = pos;
        index++;
    }
    //right
    if(i < boardSize && (board[i+1][j] < 4 || board[i+1][j] === 6 || board[i+1][j] === 12  || board[i+1][j] === 13)){
        pos = new Object();
        pos.i = i+1;
        pos.j = j;
        pos.distance = getDistance(pos,shape);
        ans[index] = pos;
        index++;
    }

    //down
    if(j < boardSize && (board[i][j+1] < 4 || board [i][j+1] === 6  || board [i][j+1] === 12 || board [i][j+1] === 13)){
        pos = new Object();
        pos.i = i;
        pos.j = j+1;
        pos.distance = getDistance(pos,shape);
        ans[index] = pos;
        index++;
    }
    //left
    if(i > 0 && (board[i-1][j] < 4|| board[i-1][j] === 6 || board[i-1][j] === 12 || board[i-1][j] === 13)){
        pos = new Object();
        pos.i = i-1;
        pos.j = j;
        pos.distance = getDistance(pos,shape);
        ans[index] = pos;
    }
    return ans;
}

function getDistance(a,b){
    return 1.0 * Math.sqrt(     (Math.pow(a.i-b.i,2)+Math.pow(a.j-b.j,2))      );
}

function printBoard(){
    var ans="";
    for (var i = 0; i < board.length;i++){
        ans+="\n";
        for (var j =0; j<board[i].length;j++){
            ans+=board[j][i];

        }
    }
    console.log(ans);

}

function clearPacman(){
    for (var i = 0; i < board.length;i++) {
        for (var j = 0; j < board[i].length; j++) {
            if (board[i][j] === 2 || board[i][j] === 5 )
                board[i][j] = 0;
        }
    }
}



