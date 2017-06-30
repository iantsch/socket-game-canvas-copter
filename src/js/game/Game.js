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
import Painter from '../game/Painter';

export const raf = window.requestAnimationFrame;

export default class Game {

    constructor(canvasId, parentId, gameData) {
        this.container = document.getElementById(parentId);
        if (!this.container) {
            return false;
        }

        this.callback = {};

        this.gameData = {
            canvas: {
                node: null,
                width: 500,
                height: 300,
                fps: 60,
                fill: '#000000',
                difficulty: 1.67
            },
            walls: {
                counter: 0,
                separation: 19,
                fill: '#dddddd',
                width: 20,
                height: {
                    start: 60,
                    max: 700,
                    interval: 5,
                    step: 10,
                    current: 0
                },
                step: 5,
                current: []
            },
            obstacles: {
                counter: 0,
                separation: 250,
                fill: '#dddddd',
                width: 20,
                height: 150,
                current: []
            },
            players: [],
            delta: {
                time: 0,
                x: 0,
                y: 0
            },
            lastUpdate: 0,
            running: false,
            context: null
        };

        for (let optionType in gameData) {
            for (let subOption in gameData[optionType]) {
                this.gameData[optionType][subOption] = gameData[optionType][subOption];
            }
        }
        
        this.calculateCanvasRelatedValues();

        this.playerManager = new PlayerManager(this.gameData.canvas);
        
        this.gameData.canvas.node = this.createCanvas(canvasId);
        this.gameData.context = this.gameData.canvas.node.getContext('2d');
        this.resetGameData();
        
        this.update = this.update.bind(this);
    }

    createCanvas(canvasId) {
        const canvas = document.createElement("canvas");
        canvas.id = canvasId;
        canvas.width = this.gameData.canvas.width;
        canvas.height = this.gameData.canvas.height;
        this.container.appendChild(canvas);
        return canvas;
    }
    
    calculateCanvasRelatedValues() {
        
    }

    resetGameData() {
        this.gameData.walls.height.current = this.gameData.walls.height.start;
        this.gameData.walls.step = this.gameData.walls.height.step;
        this.gameData.walls.current.length = 0;
        
        this.gameData.obstacles.counter = this.gameData.obstacles.separation - this.gameData.obstacles.width;
        this.gameData.obstacles.current.length = 0;
        
        this.playerManager.players.forEach(player => {
            player.y = Math.round(this.gameData.canvas.height/2);
            player.isAlive = true;
            player.totalDistance = 0;
        });
        
        this.gameData.delta.time = 0;
        this.gameData.delta.x = 0;
        this.gameData.lastUpdate = Date.now();
        this.createInitialWalls();
        Painter.draw(this.gameData);
    }

    startGame() {
        if (this.gameData.running) {
            return;
        }

        this.resetGameData();
        this.gameData.running = true;
        raf(this.update);
    }
    
    update() {
        if (!this.gameData.running) {
            return;
        }
        const now = Date.now();
        this.gameData.delta.time = (now - this.gameData.lastUpdate)/1000;
        this.gameData.delta.x = this.gameData.canvas.difficulty * this.gameData.canvas.fps * this.gameData.delta.time;
        this.gameData.lastUpdate = now;
        this.gameData.players.length = 0;

        let alivePlayers = this.playerManager.getAlivePlayers();
        alivePlayers.forEach(playerID => {
            const copter = this.playerManager.getPlayerByID(playerID);
            copter.isAlive = !this.checkForImpact(copter);
            if (!copter.isAlive) {
                this.callback.collision();
            } else {
                this.gameData.players.push(copter);
            }
        });

        alivePlayers = this.playerManager.getAlivePlayers();

        if (alivePlayers.length > 0) {
            this.createWalls();
            this.createObstacles();
            alivePlayers.forEach(playerID => {
                const copter = this.playerManager.getPlayerByID(playerID);
                copter.update(this.gameData.delta.time, this.gameData.canvas.fps);
                copter.totalDistance++;
                this.callback.tick(copter.ID);
            });
            this.callback.draw();
            Painter.draw(this.gameData);
            raf(this.update);
        } else {
            this.endGame();
        }
    }

    checkForImpact(copter) {
        if (this.gameData.obstacles.current.length >=1) {
            for (let obstacle of this.gameData.obstacles.current){
                if(
                    obstacle.x >= copter.x &&
                    obstacle.x <= (copter.x+this.gameData.obstacles.width)
                ) {
                    if (
                        copter.y >= obstacle.y &&
                        copter.y <= (obstacle.y + this.gameData.obstacles.height)
                    ) {
                        return true;
                    }
                }
            }
        }

        for (let wall of this.gameData.walls.current){
            if (wall.x < this.gameData.walls.width + copter.width) {
                if (
                    (
                        this.gameData.walls.current[0].width == (this.gameData.canvas.width + this.gameData.walls.width) || // first wall
                        wall.x >=0 // all other walls
                    ) && (
                        copter.y < wall.height || //top
                        copter.y > (this.gameData.canvas.height - copter.height - (wall.y-wall.height)) // bottom
                    )
                ) {
                    return true;
                }
            }
        }

        if (copter.y < 0 || copter.y > (this.gameData.canvas.height - copter.height)) {
            return true;
        }

        return false;
    }

    createInitialWalls() {
        const newwall = {
            x: 0,
            y: this.gameData.walls.height.current,
            width : this.gameData.canvas.width + this.gameData.walls.width,
            height : (this.gameData.walls.height.current/2)
        };
        this.gameData.walls.current.push(newwall);
    }

    createWalls() {
        if (this.gameData.walls.counter++ >= Math.floor(this.gameData.walls.separation/this.gameData.delta.x)) {
            const previousHeight = this.gameData.walls.current[this.gameData.walls.current.length-1].height;
            const plusMinus = Math.round(Math.random());
            const bigOne = Math.round(Math.random()*10);
            let newHeight;

            if (bigOne == 10) {
                newHeight = this.gameData.walls.height.current/2;
            } else if (plusMinus == 1) {
                newHeight = previousHeight + Math.floor(Math.random()*this.gameData.walls.step);
            } else {
                newHeight = previousHeight - Math.floor(Math.random()*this.gameData.walls.step);
            }

            if (newHeight > this.gameData.walls.height.current) {
                newHeight = this.gameData.walls.height.current - this.gameData.walls.step;
            }

            if (newHeight < 0) {
                newHeight = this.gameData.walls.step;
            }

            const newWall = {
                x: this.gameData.canvas.width,
                y: this.gameData.walls.height.current,
                width: this.gameData.walls.width,
                height: newHeight
            };
            this.gameData.walls.current.push(newWall);
            this.gameData.walls.counter = 0;
        }

        let i = 0;
        for (let wall of this.gameData.walls.current) {
            if (wall.x <= - (2*wall.width)) {
                this.gameData.walls.current.splice(i, 1);
            }
            ++i;
        }
    }

    createObstacles() {
        if (this.gameData.obstacles.counter++ >= Math.floor(this.gameData.obstacles.separation/this.gameData.delta.x)) {
            if (
                this.gameData.walls.height.current <= this.gameData.walls.height.max &&
                this.gameData.walls.height.interval > 0 &&
                (this.gameData.walls.height.interval++ == this.gameData.walls.height.interval)
            ) {
                this.gameData.walls.height.current += this.gameData.walls.height.step;
                this.gameData.walls.step++;
                this.gameData.walls.height.interval = 0;
            }
            this.gameData.canvas.difficulty += .01;
            const newObstacle = {
                x: this.gameData.canvas.width,
                y: Math.floor((Math.random() * (this.gameData.canvas.height - (2*this.gameData.walls.height.current))) + (this.gameData.walls.height.current/2))
            };
            this.gameData.obstacles.current.push(newObstacle);
            this.gameData.obstacles.counter = 0;
        }

        let i = 0;
        for (let obstacle of this.gameData.obstacles.current) {
            if (obstacle.x <= - (this.gameData.canvas.width)) {
                this.gameData.obstacles.current.splice(i, 1);
            }
            ++i;
        }
    }

    endGame() {
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
        this.gameData.canvas.width = this.gameData.canvas.node.width = settings.width;
        this.gameData.canvas.height = this.gameData.canvas.node.height = settings.height;
        this.calculateCanvasRelatedValues();
    }

    setCallback(callback, type) {
        this.callback[type] = callback;
    }
}
