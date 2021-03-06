SnakeDirection = {
  UP : 0,
  DOWN : 1,
  RIGHT : 2,
  LEFT : 3
}
  
var game = new Phaser.Game(1000, 600, Phaser.AUTO, 'phaser-example', { preload: preload, create: create, render: render, generateFood: generateFood, foodCollision: foodCollision });

var score = 0;
var debugKey;
var shouldDebug = false;
var food, points, keyStyle, valueStyle, scoreTextValue, rope, head, length, pointsLen; 
var shouldGrow = false;
  
function preload() {

    game.load.image('snake', 'assets/snake.png');
    game.load.image('food', 'assets/firstaid.png');
}
   
function create() {
    
    // Design hereq
    game.stage.backgroundColor = '#061f27';
    
    // Add Text to top of game
    keyStyle = { font: "bold 18px calibri", fill: "#46c0f9", align: "center" };
    valueStyle = { font: "bold 18px calibri", fill: "#fff", align: "center" };

    // Score
    game.add.text(30, 20, "SCORE: ", keyStyle);
    scoreTextValue = game.add.text(90, 18, score.toString(), valueStyle);
  
  
    var count = 0;
//    length = 918 / 20; 
    length = (459/2) / 20;
    
    var prevLocations = [];
    var currentStatus = SnakeDirection.RIGHT;
    food = {};
    points = [];
  
    // Genereate the first food
    this.generateFood();
  
    for (var i = 0; i < 20; i++)
    {
      newPoint = new Phaser.Point(i * length, 0);
      prevLocations.push(newPoint);
      points.push(newPoint);
    }
    
    cursors = game.input.keyboard.createCursorKeys();
    rope = game.add.rope(32, (0,0), 'snake', null, points);    
    
    rope.scale.set(0.8);
  
    rope.updateAnimation = function() {
      
      pointsLen = points.length - 1 ;
      
      // record snake movement
      var firstPoint = points[pointsLen],
          lastPoint = points[0],
          oldLastCellx = lastPoint.x,
          oldLastCelly = lastPoint.y;

//      if (shouldGrow) {
//        points = [];
//        for (var i = 0; i < pointsLen + 1; i++)
//        {
//          newPoint = new Phaser.Point(i * length, 0);
//          prevLocations.push(newPoint);
//          points.push(newPoint);
//        }
//        rope.unshift(game.add.rope(32, oldLastCellx, oldLastCelly, 'snake', points));
//        shouldGrow = false;
//      }
      
      // Check for food collision
      head = points[pointsLen];
      
      foodCollision();

      prevLocations[pointsLen].x = head.x;
      prevLocations[pointsLen].y = head.y;
      speed = length;
      // decide where the head is going 
      if (cursors.up.isDown){

        head.y -= speed;
        currentStatus = SnakeDirection.UP;
      }
      else if (cursors.down.isDown){
        head.y += speed; 
        currentStatus = SnakeDirection.DOWN;
      }
      else if (cursors.right.isDown){
        head.x += speed; 
        currentStatus = SnakeDirection.RIGHT;
      }
      else if (cursors.left.isDown){
        head.x -= speed; 
        currentStatus = SnakeDirection.LEFT;
      }
//       if no action is selected, follow the prev action 
      else{
        
        if (currentStatus == SnakeDirection.UP){
          head.y -= speed; 
        }  
        else if (currentStatus == SnakeDirection.DOWN){
          head.y += speed;
        }
        else if (currentStatus == SnakeDirection.RIGHT){
          head.x += speed;
        }
        else if (currentStatus == SnakeDirection.LEFT){
          head.x -= speed;
        } 
      }
      
      // Check for food collision
      foodCollision();    
      
      for (var i = 0; i < points.length - 1; i++)
      {
        prevLocations[i].x = points[i].x;
        prevLocations[i].y = points[i].y;
        points[i].x = prevLocations[i+1].x ;
        points[i].y = prevLocations[i+1].y ;        
//          this.points[i].y = Math.sin(i * 0.5 + count) * 20;

      }
    };

    debugKey = game.input.keyboard.addKey(Phaser.Keyboard.D);
    debugKey.onDown.add(toggleDebug);
}   

//function grow(){
//  
//}
 
function generateFood() {

        // Chose a random place on the grid.
        // X is between 0 and 585 (39*15)
        // Y is between 0 and 435 (29*15)

        var randomX = Math.floor(Math.random() * 40 *15) ,
            randomY = Math.floor(Math.random() * 30 *15);

        // Add a new food.
        food = game.add.sprite(randomX, randomY, 'food');
//        food.scale.setTo(2, 2);
}
  
function foodCollision() {
  if (rope.getBounds().contains(food.x, food.y)) {
//            rope.destroyPhase();
    
            // Next time the snake moves, a new point will be added to its length
            shouldGrow = true;

            // Destroy the old food
            food.destroy();

            // Make a new one
            this.generateFood();

            // Increase score
            score++;

//             Refresh scoreboard
            scoreTextValue.text = score.toString();

  }
}
  
function render() {

    if (shouldDebug)
    {
        game.debug.ropeSegments(rope);
    }

//    game.debug.text('(D) to show debug', 20, 32);

}

function toggleDebug() {

    shouldDebug = !shouldDebug;

}