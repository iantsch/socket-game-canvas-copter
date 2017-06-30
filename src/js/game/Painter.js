export default class Painter {
    static init(gameData) {
        console.log('Painter init');
        Painter.drawBG(gameData.context, gameData.canvas);
    }

    static drawBG(draw, context) {
        draw.clearRect(0,0,context.width,context.height);
        draw.beginPath();
        draw.fillStyle = context.fill;
        draw.fillRect(0,0,context.width,context.height);
        draw.fill();
    }

    static roundedRect(draw, x, y, width, height, radius) {
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

    static draw(gameData) {
        Painter.drawBG(gameData.context, gameData.canvas);
        Painter.drawWalls(gameData.context, gameData.walls, gameData.canvas, gameData.delta);
        Painter.drawObstacles(gameData.context, gameData.obstacles, gameData.delta);
        Painter.drawPlayers(gameData.context, gameData.players);
    }

    static drawWalls(draw, walls, canvas, delta) {
        let i = 0;
        for (let wall of walls.current) {
            wall.x -= delta.x;

            draw.save();
            draw.beginPath();
            draw.fillStyle = walls.fill;
            draw.fillRect(wall.x, 0, wall.width + delta.x, wall.height);
            draw.fill();
            draw.restore();

            draw.beginPath();
            draw.fillStyle = walls.fill;
            draw.fillRect(wall.x, canvas.height-(wall.y-wall.height), wall.width + delta.x, wall.y-wall.height);
            draw.fill();

            if (wall.x <= - (2 * wall.width)) {
                walls.current.splice(i, 1);
            }
            ++i;
        }
    }

    static drawObstacles(draw, obstacles, delta) {
        let i = 0;
        for (let obstacle of obstacles.current) {
            draw.beginPath();
            draw.fillStyle = obstacles.fill;
            Painter.roundedRect(draw, obstacle.x-=delta.x, obstacle.y, obstacles.width, obstacles.height, 10);
            draw.fill();
            ++i;
        }
    }

    static drawPlayers(draw, players) {
        let i = 0;
        for (let player of players) {
            draw.save();
            draw.translate(player.x, player.y);
            draw.rotate(player.rotation);

            draw.beginPath();
            Painter.roundedRect(draw, 0, 0, player.width, player.height, 10);
            draw.fillStyle = player.color;
            draw.fill();

            draw.restore();
            ++i;
        }
    }
}