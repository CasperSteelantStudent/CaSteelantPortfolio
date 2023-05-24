let Enemies = [];
let posX, posY; // position of the object
let velX = 5,
    velY = 5; // velocity of the object
let angle = 0; // rotation angle of the object
let rotationSpeed = 0.1; // speed of rotation
let Score = 0;

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
        this.posX += this.velX;
        this.posY += this.velY;
        if (this.posX < this.size / 2 || this.posX > width - this.size / 2) {
            this.velX *= -1;
        }
        if (this.posY < this.size / 2 || this.posY > height - this.size / 2) {
            this.velY *= -1;
        }
        this.angle += this.rotationSpeed;
    }


    display() {
        push();
        if (this.isCube) {
            // Draw cube
            translate(this.posX, this.posY);
            rotate(this.angle);
            scale(0.7);
            fill(this.color);
            rect(-this.size / 2, -this.size / 2, this.size, this.size);
            rect(-this.size / 2 - 3, -this.size / 2 - 3, this.size + 6, 10);
            line(0, -this.size / 2, 0, -this.size / 2 - 15);
            fill(255, 0, 255, 240);
            translate(0, -60);
            noStroke();
            for (var r1 = 0; r1 < 10; r1++) {
                ellipse(0, 10, 25, 50);
                rotate(PI / 5);
            }
            fill(218, 165, 32);
            circle(0, 0, 20);
        } else {
            // Draw square
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
            if (!this.isCube) {
                transformsound.play();
                this.isCube = !this.isCube;
                Score += 1;
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

        translate(-(this.posX - 200), -(this.posY - 100));
        // Draw eyes

        let x1 = constrain(mouseX, (this.posX - 20), (this.posX + 20));
        let y = constrain(mouseY, (this.posY - 20), (this.posY + 20));

        fill(0, 255, 0);
        for (let i = -1; i <= 1; i += 2) {
            triangle(x1 + i * 40, y, x1 + i * 12, y, x1 + i * 20, y + 9);
        }
    }
}

function setup() {
    transformsound = loadSound('Media/transform.wav');
    createCanvas(600, 400);
    textAlign(CENTER);
    textSize(20);
    robot = new Robot(random(200, 400), random(100, 300));
    amount = random(5, 10);
    for (let i = 0; i <= amount - 1; i++) {
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
    background(220);
    push();
    if (Score == floor(amount)) {
        robot.display();
        text('YOU LIVE!', 300, 170);
        text('score: 42', 300, 190);  //if i were to implement an actual timer, it'd probably just keep track of the time that has passed and detract that from the maximum score, but 42 is funnier
    }
    else {
        robot.display();
        for (let i = 0; i <= amount - 1; i++) {
            Enemies[i].update();
            Enemies[i].display();
        }
        fill(0);
        noStroke();
        text("you're being targeted by bombs", 300, 70);
        text("disarm the bombs by clicking on them", 300, 130);
        fill(255,0,0);
        textStyle(BOLD);
        text("DON'T PANIC!", 300, 100);
    }
    pop();
}

function mouseClicked() {
    for (let i = 0; i < amount; i++) {
        Enemies[i].onClick(mouseX, mouseY);
    }

}
