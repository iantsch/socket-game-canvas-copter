/**
 * 
 * Based on the original flash copter game:
 * http://www.seethru.co.uk/zine/south_coast/helicopter_game.htm
 * 
 * Based on the jsCopter adpation from Pete Goodman:
 * http://petegoodman.com
 *
 */

import PlayerManager from './PlayerManager';

export const raf = window.requestAnimationFrame;

export const roundedRect = function(draw, x, y, width, height, radius) {
    draw.beginPath();
    draw.moveTo(x,y+radius);
    draw.lineTo(x,y+height-radius);
    draw.quadraticCurveTo(x,y+height,x+radius,y+height);
    draw.lineTo(x+width-radius,y+height);
    draw.quadraticCurveTo(x+width,y+height,x+width,y+height-radius);
    draw.lineTo(x+width,y+radius);
    draw.quadraticCurveTo(x+width,y,x+width-radius,y);
    draw.lineTo(x+radius,y);
    draw.quadraticCurveTo(x,y,x,y+radius);
};

export default class Game {

    constructor(canvasId, parentId, options) {
        this.options = {
            canvas: {
                width: 500,
                height: 300,
                refreshRate: 20,
                topSpeed: 7
            },
            walls: {
                separation: 19,
                width: 20,
                step: 5,
                startHeight: 60,
                maxHeight: 700,
                heightIncreaseInterval: 5,
                heightIncreaseStep: 10
            },
            obstacles: {
                separation: 250,
                width: 20,
                height: 150
            },
            colors: {
                bg: "#000000",
                fill: "#dddddd"
            }
        };

        this.gameData = {
            walls: {
                counter: 0,
                currentHeight: 0,
                currentStep: 0,
                heightIncreaseInterval: 0,
                current: []
            },
            obstacles: {
                counter: 0,
                current: []
            },
            delta: {
                time: 0,
                x: 0
            },
            lastUpdate: 0,
            running: false
        };
        
        this.canvas = null;
        this.container = null;
        this.drawContext = null;
        this.playerManager = null;
        this.callback = {};

        this.init(canvasId, parentId, options);
    }
    
    init(canvasId, parentId, options) {
        this.container = document.getElementById(parentId);
        if (!this.container) return false;

        for (let optionType in options) {
            for (let subOption in options[optionType]) {
                this.options[optionType][subOption] = options[optionType][subOption];
            }
        }
        
        this.canvas = this.createCanvas(canvasId);
        this.drawContext = this.canvas.getContext("2d");
        this.playerManager = new PlayerManager(this.options, this.drawContext);
        
        this.createBG();
        this.resetGameData();
        this.createInitialWalls();
    }

    createCanvas(canvasId) {
        const canvas = document.createElement("canvas");
        canvas.id = canvasId;
        canvas.width = this.options.canvas.width;
        canvas.height = this.options.canvas.height;
        this.container.appendChild(canvas);
        return canvas;
    }

    createBG() {
        this.drawContext.clearRect(0,0,this.options.canvas.width, this.options.canvas.height);
        this.drawContext.beginPath();
        roundedRect(this.drawContext, 0, 0, this.options.canvas.width, this.options.canvas.height, 10);
        this.drawContext.fillStyle = this.options.colors.bg;
        this.drawContext.fill();
    }

    resetGameData() {
        this.gameData.walls.currentHeight = this.options.walls.startHeight;
        this.gameData.walls.currentStep = this.options.walls.step;
        this.gameData.walls.current.length = 0;
        
        this.gameData.obstacles.counter = this.options.obstacles.separation - this.options.obstacles.width;
        this.gameData.obstacles.current.length = 0;
        
        this.playerManager.players.forEach(player => {
            player.y = Math.round(this.options.canvas.height/2);
            player.isAlive = true;
            player.totalDistance = 0;
        });
        
        this.gameData.delta.time = 0;
        this.gameData.delta.x = 0;
        this.gameData.lastUpdate = Date.now();
        this.createInitialWalls();
    }

    startGame() {
        if (this.gameData.running) {
            return;
        }

        this.resetGameData();
        this.gameData.running = true;
        raf(this.update.bind(this));
    }
    
    update() {
        if (!this.gameData.running) {
            return;
        }
        const now = Date.now();
        this.gameData.delta.time = (now - this.gameData.lastUpdate)/1000;
        this.gameData.delta.x = this.options.canvas.refreshRate * this.options.canvas.topSpeed * this.gameData.delta.time;
        this.gameData.lastUpdate = now;
        this.draw();
        raf(this.update.bind(this));
    }


    draw() {
        let alivePlayers = this.playerManager.getAlivePlayers();
        alivePlayers.forEach(playerID => {
            const copter = this.playerManager.getPlayerByID(playerID);
            copter.isAlive = !this.checkForImpact(copter);
            if (!copter.isAlive) {
                this.callback.collision();
            }
        });
        alivePlayers = this.playerManager.getAlivePlayers();

        if (alivePlayers.length > 0) {
            this.createBG();
            alivePlayers.forEach(playerID => {
                const copter = this.playerManager.getPlayerByID(playerID);
                copter.draw(this.gameData.delta.time * this.options.canvas.refreshRate);
                copter.totalDistance++;
                this.callback.tick(copter.ID);
            });
            this.createWalls();
            this.createObstacles();

        } else {
            this.endGame();
        }
    }

    checkForImpact(copter) {
        if (this.gameData.obstacles.current.length >=1) {
            for (let obstacle of this.gameData.obstacles.current){
                if(
                    obstacle.x >= copter.x &&
                    obstacle.x <= (copter.x+this.options.obstacles.width)
                ) {
                    if (
                        copter.y >= obstacle.y &&
                        copter.y <= (obstacle.y + this.options.obstacles.height)
                    ) {
                        return true;
                    }
                }
            }
        }

        for (let wall of this.gameData.walls.current){
            if (wall.x < this.options.walls.width + copter.width) {
                if (
                    (
                        this.gameData.walls.current[0].width == (this.options.canvas.width + this.options.walls.width) || // first wall
                        wall.x >=0 // all other walls
                    ) && (
                        copter.y < wall.height || //top
                        copter.y > (this.options.canvas.height - copter.height - (wall.y-wall.height)) // bottom
                    )
                ) {
                    return true;
                }
            }
        }

        if (copter.y < 0 || copter.y > (this.options.canvas.height - copter.height)) {
            return true;
        }

        return false;
    }

    createInitialWalls() {
        const draw = this.drawContext;
        
        const newwall = {
            x: 0,
            y: this.gameData.walls.currentHeight,
            width : this.options.canvas.width + this.options.walls.width,
            height : (this.gameData.walls.currentHeight/2)
        };
        this.gameData.walls.current.push(newwall);

        draw.save();
        draw.beginPath();
        draw.fillStyle = this.options.colors.fill;
        draw.fillRect(0, 0, newwall.width, newwall.height);
        draw.fill();
        draw.restore();

        draw.beginPath();
        draw.fillStyle = this.options.colors.fill;
        draw.fillRect(0, this.options.canvas.height-newwall.height, newwall.width, newwall.height);
        draw.fill();
    }

    createWalls() {
        const draw = this.drawContext;
        
        if (this.gameData.walls.counter++ >= Math.floor(this.options.walls.separation/this.gameData.delta.x)) {
            const previousHeight = this.gameData.walls.current[this.gameData.walls.current.length-1].height;
            const plusMinus = Math.round(Math.random());
            const bigOne = Math.round(Math.random()*10);
            let newHeight;

            if (bigOne == 10) {
                newHeight = this.gameData.walls.currentHeight/2;
            } else if (plusMinus == 1) {
                newHeight = previousHeight + Math.floor(Math.random()*this.gameData.walls.currentStep);
            } else {
                newHeight = previousHeight - Math.floor(Math.random()*this.gameData.walls.currentStep);
            }

            if (newHeight > this.gameData.walls.currentHeight) {
                newHeight = this.gameData.walls.currentHeight - this.gameData.walls.currentStep;
            }

            if (newHeight < 0) {
                newHeight = this.gameData.walls.currentStep;
            }

            const newWall = {
                x: this.options.canvas.width,
                y: this.gameData.walls.currentHeight,
                width: this.options.walls.width,
                height: newHeight
            };
            this.gameData.walls.current.push(newWall);
            this.gameData.walls.counter = 0;
        }

        let i = 0;
        for (let wall of this.gameData.walls.current) {
            wall.x-=this.gameData.delta.x;

            draw.save();
            draw.beginPath();
            draw.fillStyle = this.options.colors.fill;
            draw.fillRect(wall.x, 0, wall.width + this.gameData.delta.x, wall.height);
            draw.fill();
            draw.restore();

            draw.beginPath();
            draw.fillStyle = this.options.colors.fill;
            draw.fillRect(wall.x, this.options.canvas.height-(wall.y-wall.height), wall.width + this.gameData.delta.x, wall.y-wall.height);
            draw.fill();

            if (wall.x <= - (2*wall.width)) {
                this.gameData.walls.current.splice(i, 1);
            }
            ++i;
        }
    }

    createObstacles() {
        const draw = this.drawContext;
        
        if (this.gameData.obstacles.counter++ >= Math.floor(this.options.obstacles.separation/this.gameData.delta.x)) {
            if (
                this.gameData.walls.currentHeight <= this.options.walls.maxHeight &&
                this.options.walls.heightIncreaseInterval > 0 &&
                (this.gameData.walls.heightIncreaseInterval++ == this.options.walls.heightIncreaseInterval)
            ) {
                this.gameData.walls.currentHeight += this.options.walls.heightIncreaseStep;
                this.gameData.walls.currentStep++;
                this.gameData.walls.heightIncreaseInterval = 0;
            }

            const newObstacle = {
                x: this.options.canvas.width,
                y: Math.floor((Math.random() * (this.options.canvas.height - (2*this.gameData.walls.currentHeight))) + (this.gameData.walls.currentHeight/2))
            };
            this.gameData.obstacles.current.push(newObstacle);
            this.gameData.obstacles.counter = 0;
        }

        let i = 0;
        for (let obstacle of this.gameData.obstacles.current) {
            draw.beginPath();
            draw.fillStyle = this.options.colors.fill;
            this.roundedRect(draw, obstacle.x-=this.gameData.delta.x, obstacle.y, this.options.obstacles.width, this.options.obstacles.height, 10);
            draw.fill();
            if (obstacle.x <= - (this.options.canvas.width)) {
                this.gameData.obstacles.current.splice(i, 1);
            }
            ++i;
        }
    }

    endGame() {
        // set running variable
        this.gameData.running = false;

        if (this.playerManager.numberOfPlayers() > 0) {
            setTimeout(() => {
                this.callback.round();
                this.startGame();
            }, 2000);
        }
    }

    handleControl(userId, direction) {
        this.playerManager.navigatePlayer(userId, direction);
    }

    addPlayer(name) {
        return this.playerManager.addPlayer(name);
    }

    removePlayer(playerID) {
        this.playerManager.removePlayer(playerID);
        if (this.playerManager.numberOfPlayersAlive() < 1) {
            this.endGame();
        }
    }

    updateCanvas (settings) {
        this.options.canvas.width = this.canvas.width = settings.width;
        this.options.canvas.height = this.canvas.height = settings.height;
    }

    setRoundCallback(callback) {
        this.setCallback(callback, 'round');
    }

    setCollisionCallback(callback) {
        this.setCallback(callback, 'collision');
    }

    setTickCallback(callback) {
        this.setCallback(callback, 'tick');
    }

    setCallback(callback, type) {
        this.callback[type] = callback;
    }
}
