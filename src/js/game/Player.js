
import {roundedRect} from './Game';

export default class Player {
    constructor(context) {
        this.physics = {
            terminalVelocity: 7,
            gravity: 1,
            friction: 0.9
        };
        this.drawContext = context;
        this.mouseDown = false;

        this.x = 20;
        this.y = 0;
        this.width = 30;
        this.height = 15;
        this.speed = 0;
        this.rotation = 0;
        this.acceleration = .6;
        this.topSpeed = 7;

        this.name = '';
        this.color = '';
        this.ID = null;
        this.totalDistance = 0;
        this.maxDistance = 0;
        this.isPlaying = false;
        this.isAlive = false;
        this.canceled = false;
        this.wins = 0;
    }

    draw(delta) {

        const draw = this.drawContext;

        if(this.mouseDown === true) {
            this.speed -= this.acceleration;
            if (this.speed < -this.topSpeed) this.speed = -this.topSpeed;
            this.rotation -= 0.0075;
            if (this.rotation < -0.25) this.rotation = -0.25;
        } else {
            this.speed = (this.speed + this.physics.gravity) * this.physics.friction;
            if(this.speed > this.physics.terminalVelocity) this.speed = this.physics.terminalVelocity;
            this.rotation += 0.015;
            if (this.rotation > 0.15) this.rotation = 0.15;
        }

        this.y += this.speed * delta;

        this.totalDistance += this.topSpeed * delta;
        if (this.maxDistance < this.totalDistance) {
            this.maxDistance = this.totalDistance;
        }

        draw.save();
        draw.translate(this.x, this.y);
        draw.rotate(this.rotation);

        draw.beginPath();
        roundedRect(draw, 0, 0, this.width, this.height, 10);
        draw.fillStyle = this.color;
        draw.fill();

        draw.restore();
    }

    navigate(direction) {
        this.mouseDown = direction;
    }
};
