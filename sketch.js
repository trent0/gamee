let port;
let joyX = 0, joyY = 0, sw = 0;
let connectButton;
let circleX, circleY;
let speed = 3;


var PLAY = 1;
var END = 0;
var gameState = PLAY;


var track, trackImg;

var mq, mqImg;

var coin, coinImg;

var obstacle, obstacleImg;

var score;

var coinSound, obstacleSound;

function preload(){
  

  
  trackImg = loadImage("raceTrack.png");
  
  mqImg = loadImage("redcar1.png");
  
  coinImg = loadImage("coin.png");
  
  obstacleImg = loadImage("stone.png");
  
  coinSound = loadSound("checkPoint.mp3");
  
  obstacleSound = loadSound("die.mp3");
  
}

function setup(){
  port = createSerial();
 
  createCanvas(500,700)
  circleX = width / 2;
  circleY = height / 2;

  connectButton = createButton("Connect");
  connectButton.mousePressed(connect);
  
  track = createSprite(250,50);
  track.addImage(trackImg);
  track.velocityY = -15;
  track.scale = 3;
  
 
  mq = createSprite(250,100,250,250);
  mq.addImage(mqImg);
  mq.scale = 0.3;
  
  coinGroup = new Group();
  obstacleGroup = new Group();
  
  mq.setCollider("rectangle",0,0,250,450);
  mq.debug = false;
 
  score = 0;
}

function draw(){
  
  background("black")
  
  if(gameState === PLAY){
  
  if(track.y < 0){
      track.y = track.width/2;
  }
  
  
  if(joyX < 0){
    mq.x = mq.x + 3;  
  }  
  
  
  if(joyX > 0){
    mq.x = mq.x - 3;  
  }
  
  if(mq.isTouching(coinGroup)){
    
    coinGroup.destroyEach();
    coinSound.play();
    score = score + 5;
  }  
   
  spawnCoins();
  spawnObstacles();
    
  }
  
    if(mq.isTouching(obstacleGroup)){
    coinGroup.destroyEach();
    obstacleGroup.destroyEach();
    track.velocityX = 0;
   gameState = END  
    obstacleSound.play();
  }    
  else if(gameState === END){
    
    score = 0;

    stroke("black");
    fill("blue");
    textSize(50);
    text("YOU CRASHED",110,345);
    
    stroke("black");
    fill("blue");
    textSize(50);
    text("GAME OVER",35,400);
    
  } 
  drawSprites();
  
  stroke("black");
  fill("white");
  textSize(15);
  text("Score: "+ score, 100,50);
  let str = port.readUntil("\n");
  let values = str.split(",");
  if (values.length > 2) {
    joyX = values[0];
    joyY = values[1];
    sw = Number(values[2]);

    if (joyX > 0) {
      circleX += speed;
    } else if (joyX < 0) {
      circleX -= speed;
    }

    if (joyY > 0) {
      circleY += speed;
    } else if (joyY < 0) {
      circleY -= speed;
    }
  }


} 

function spawnCoins(){
  
  if (frameCount % 150 === 0){
      var coin = createSprite(300,545,10,10);

      coin.x = Math.round(random(250,500));
      coin.y = Math.round(random(250,500));  
      coin.addImage(coinImg);
      coin.scale = 0.1;
      coin.velocityY = -5;

      coin.lifetime = 250;

      coinGroup.add(coin);
  }
}

function spawnObstacles() {
  if(frameCount % 200 === 0) {
    var obstacle = createSprite(450,600,10,40);
    
    obstacle.x = Math.round(random(300,400));
    obstacle.y = Math.round(random(300,500));  
    obstacle.velocityY = -4;
    obstacle.addImage(obstacleImg);
            
    obstacle.scale = 0.2;
    obstacle.lifetime = 250;
    
    obstacleGroup.add(obstacle);
  }
}
function connect() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
  } else {
    port.close();
  }

}
function mousePressed() {
    let value = digitalRead(2);
    if (value == HIGH) {
      value = LOW;
    } else {
      value = HIGH;
    }
    let data = {
      pin: 2,
      value: value
    };
    socket.emit('digital', data);
  } 