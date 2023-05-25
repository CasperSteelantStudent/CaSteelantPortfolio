let Enemies = [];
let energyBalls = [];
let posX, posY; // position of the object
let velX = 5,
    velY = 5; // velocity of the object
let angle = 0; // rotation angle of the object
let rotationSpeed = 0.1; // speed of rotation
let Score = 0;      //The score equals the amount of bombs that were transformed
let H2G2;
let quotes; // Array to store the quotes
let timer = 1500;
let explosion;
let frameNumber = 0;
let gameOver = false;
let explosionSoundPlayed = false;
let levelclearPlayed = false;

class Enemy {
    constructor(posX, posY, velX, velY, size, color) {
        this.posX = posX;
        this.posY = posY;
        this.velX = velX;
        this.velY = velY;
        this.size = size;
        this.color = color;
        this.angle = 0;
        this.rotationSpeed = random(0.05, 0.1);
        this.isCube = false;
    }

    update() {
        this.posX += this.velX;                     //makes the enemies move around the screen
        this.posY += this.velY;
        if (this.posX < this.size / 2 || this.posX > width - this.size / 2) {  //if the enemy reaches the edge of the screen, invert the direction of either x or y
            this.velX *= -1;
        }
        if (this.posY < this.size / 2 || this.posY > height - this.size / 2) {
            this.velY *= -1;
        }
        this.angle += this.rotationSpeed;       //makes the enemies rotate
    }


    display() {

        push(); //remembers the object before any translations or rotations
        if (this.isCube) {          //checks wether or not the object has been clicked or not, displays either a bomb or a flower pot
            stroke(10);
            translate(this.posX, this.posY); //continually moves the object around
            rotate(this.angle);     //continually rotates the object
            //flowers
            scale(0.7);     //scales the entire flower
            fill(this.color);
            rect(-this.size / 2, -this.size / 2, this.size, this.size);
            rect(-this.size / 2 - 3, -this.size / 2 - 3, this.size + 6, 10);
            line(0, -this.size / 2, 0, -this.size / 2 - 15);
            fill(255, 0, 255, 240);
            translate(0, -60);
            noStroke();
            for (var r1 = 0; r1 < 10; r1++) {       //a loop that creates ellipses to emulate flower petals
                ellipse(0, 10, 25, 50);
                rotate(PI / 5);
            }
            fill(218, 165, 32);
            circle(0, 0, 20);       //center of the flower
        } else {
            // Draw bomb
            translate(this.posX, this.posY);
            rotate(this.angle);
            fill(0);
            stroke(10);
            line(-this.size / 2 - 2, -this.size / 2, this.size / 2, -this.size / 2);
            rect(-this.size / 2 - 2, -this.size / 2 - 12, this.size / 2 + 10, 24);
            circle(-this.size / 2, -this.size / 2, this.size);
        }

        pop();
    }


    isClicked(x, y) {
        return (
            x >= this.posX - this.size * 1.3 &&
            x <= this.posX + this.size * 1.3 &&
            y >= this.posY - this.size * 1.3 &&
            y <= this.posY + this.size * 1.3
        );
    }

    onClick(x, y) {
        if (this.isClicked(x, y)) {
            if (!this.isCube) {         //checks wether or not the coordinates sent by mouseClick are within the boundaries of the bomb, and changes isCube to trigger the other shape
                transformsound.play();      //plays a sound effect
                this.isCube = !this.isCube;     //changes the isCube to true (shouldn't really be cube anymore, might rename)
                Score += 1;         //adds 1 to the score
                let energyBall = new EnergyBall(x, y);      //creates a new energy ball to hide the switching of sprites
                energyBalls.push(energyBall);

            }
        }
    }
}

class Robot {
    constructor(posX, posY) {
        this.posX = posX;
        this.posY = posY;
        this.x = posX - 200;
        this.y = posY - 100;
    }

    display() {
        stroke(0);
        strokeWeight(2);

        // Draw arms
        translate(this.posX - 200, this.posY - 100);
        fill(245);
        arc(230, 189.5, 70, 65, -HALF_PI - QUARTER_PI, QUARTER_PI / 2, CHORD);
        arc(170, 189.5, 70, 65, HALF_PI + (QUARTER_PI * 3) / 2, -(HALF_PI - QUARTER_PI), CHORD);
        arc(144, 215, 30, 60, PI, 0);
        arc(256, 215, 30, 60, PI, 0);
        fill(0);
        ellipse(144, 190, 10, 15);
        ellipse(256, 190, 10, 15);
        fill(40);
        ellipse(144, 222, 30, 20);
        ellipse(256, 222, 30, 20);

        // Draw legs
        fill(255);
        strokeWeight(2);
        strokeJoin(ROUND);
        strokeWeight(2);
        // Left leg
        triangle(160, 210, 190, 240, 174, 260);
        triangle(190, 240, 190, 280, 170, 264);
        arc(190, 280, 80, 40, PI, PI + QUARTER_PI, PIE);
        // Right leg
        triangle(240, 210, 210, 240, 226, 260);
        triangle(210, 240, 210, 280, 230, 264);
        arc(210, 280, 80, 40, -QUARTER_PI, 0, PIE);

        // Draw lower torso
        strokeWeight(2);
        circle(200, 200, 80);

        // Draw upper torso
        fill(0);
        rect(170, 185, 60, 15);
        fill(255);
        beginShape();
        vertex(180, 130);
        vertex(220, 130);
        vertex(240, 200);
        vertex(230, 200);
        vertex(225, 185);
        vertex(175, 185);
        vertex(170, 200);
        vertex(160, 200);
        endShape(CLOSE);
        strokeWeight(2);
        fill(230);
        square(180, 130, 40);

        // Draw head
        strokeWeight(2);
        fill(255);
        ellipse(200, 100, 120, 120);

        if (Score == floor(amount)) {  //The score equals the amount of bombs inside the Enemies array
            textAlign(LEFT);
            text("it's lying, you've only got " + Score, 300, 100);         //displays the actual score instead of the joke score
        } else if (millis() >= amount * timer) {       //Game Over trigger when time runs out
            textAlign(LEFT);
            text(quotes.getColumn(column), 300, 100);
        }


        translate(-(this.posX - 200), -(this.posY - 100));      //had to translate the eyes seperately 

        let x1 = constrain(mouseX, (this.posX - 20), (this.posX + 20));     //constrains the position of the eyes between a box, while still trying to follow the cursor
        let y = constrain(mouseY, (this.posY - 20), (this.posY + 20));

        fill(0, 255, 0);
        for (let i = -1; i <= 1; i += 2) {
            triangle(x1 + i * 40, y, x1 + i * 12, y, x1 + i * 20, y + 9);   // Draw eyes, i makes the eyes -get drawn twice 
        }
    }

    victory() {
        if (!levelclearPlayed) {
          levelclearsound.play();
          levelclearPlayed = true;
        }
      }

    gameover() {
        if (!explosionSoundPlayed) {
          explosionsound.play();
          explosionSoundPlayed = true;
        }
      }
}

class EnergyBall {
    constructor(x, y) {
        this.x = x;                     //same x and y used by mouseClicked 
        this.y = y;
        this.radius = 50;
        this.easing = 0.05;
    }

    update() {
        let targetRadius = 0;
        this.radius = lerp(this.radius, targetRadius, this.easing);     //makes the radius slowly shrink with a sine ease
    }

    display() {         //displays the energy ball with the shrinking radius
        noStroke();
        fill(0, 255, 0);
        ellipse(this.x, this.y, this.radius * 2, this.radius * 2);
    }
}

function preload() {
    // Load the CSV file
    quotes = loadTable('Media/quotes.csv', 'csv');
    bg = loadImage('Photos/background.jpg');
    explosion = loadImage('Photos/explosion.gif'); H2G2 = loadFont('Fonts/Tw Cen MT Std Ultra Bold.otf');
    H2G2 = loadFont('Fonts/Tw Cen MT Std Ultra Bold.otf');
    transformsound = loadSound('Media/transform.wav');
    explosionsound = loadSound('Media/explosionsound.wav');
    levelclearsound = loadSound('Media/levelclear.mp3');
}

function setup() {
    column = floor(random(0, quotes.getColumnCount()));  //gets a random column from the .csv file
    timeStart = millis();           //keeps track of how long the player has been playing the game
    createCanvas(600, 400);
    textAlign(CENTER);
    textSize(20);
    robot = new Robot(200, 200);
    amount = random(5, 10);
    for (let i = 0; i <= amount - 1; i++) {                     //creates an amount of enemies equal to the amount variable
        Enemies[i] = new Enemy();
        Enemies[i].posX = random(100, 500);
        Enemies[i].posY = random(100, 300);
        Enemies[i].velX = random(2, 4);
        Enemies[i].velY = random(2, 4);
        Enemies[i].size = 50;
        Enemies[i].color = color(random(255), random(255), random(255));
    }

}

function draw() {
    background(255);
    image(bg, 0, 0, width, height);
    push();
    if (Score == floor(amount)) {  //The score equals the amount of bombs inside the Enemies array
        robot.victory();            //triggers victory function/sound
        robot.display();            //gotta keep the robot on the screen, consistency or something
        textAlign(CENTER);
        text('YOU LIVE!', 300, 80);   //positive affirmation and all that
        text('score: 42', 300, 100);  //If I were to implement an actual timer, it'd probably just keep track of the time that has passed and detract that from the maximum score, but 42 is funnier
        return;
    } else if (millis() >= amount * timer) {     //game over when the tiemr reaches a set amount, depends on how many bombs are present
        robot.gameover();                       //triggers gameover sound/function
        robot.display();
        textAlign(CENTER);
        fill(255, 0, 0);
        textStyle(BOLD);
        noStroke();
        text('YOU DIED!', 300, 80);   //tells the user he died
        text('out of time', 300, 100);
        image(explosion,0,0, width, height);
        frameNumber++;  //increases the frame number every frame
        explosion.setFrame(floor(frameNumber)); //set GIF to new frame
        return;
    }
    else {
        robot.display();
        for (let i = 0; i <= amount - 1; i++) {     //this displays and updates all the bomb objects in the array that were created during setup with the class
            Enemies[i].update();
            Enemies[i].display();
        }
        for (let i = 0; i < energyBalls.length; i++) {      //this displays and updates all energy ball objects that are created via the mouseClick condition and the energyball class
            let energyBall = energyBalls[i];
            energyBall.update();
            energyBall.display();
        }
        fill(255);
        noStroke();
        textAlign(CENTER);
        text("you're being targeted by bombs", 300, 70);
        text("disarm the bombs by clicking on them", 300, 130);
        fill(255, 0, 0);
        textStyle(BOLD);
        textFont(H2G2);
        stroke(255, 255, 0);
        text("DON'T PANIC!", 300, 100);         //prevents the user from panicking
    }
    pop();
}

function mouseClicked() {                       //when the mouse clicks on the screen, let the enemies class decide wether or not the mouse coords align with any of its objects
    for (let i = 0; i < amount; i++) {
        Enemies[i].onClick(mouseX, mouseY);
    }
}   

