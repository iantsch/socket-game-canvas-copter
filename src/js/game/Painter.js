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

    static drawCopter1(ctx, color) {
        ctx.beginPath();
        ctx.moveTo(29.26,9.662);
        ctx.lineTo(26.68,8.569);
        ctx.bezierCurveTo(26.467,8.479,26.295,8.316,26.196,8.109);
        ctx.lineTo(25.682,7.05);
        ctx.bezierCurveTo(25.405,6.476,24.862,6.071,24.231,5.969);
        ctx.lineTo(18.503,5.032);
        ctx.lineTo(17.941,3.322);
        ctx.bezierCurveTo(17.873,3.1149,17.677,2.973,17.46,2.973);
        ctx.lineTo(17.088,2.973);
        ctx.lineTo(17.088,2.229);
        ctx.bezierCurveTo(21.18,2.205,25.272,1.871,29.336,1.226);
        ctx.bezierCurveTo(29.611,1.182,29.801,0.922,29.756,0.646);
        ctx.bezierCurveTo(29.713,0.371,29.453,0.181,29.176,0.225);
        ctx.bezierCurveTo(25.166,0.86,21.127,1.19,17.088,1.215);
        ctx.lineTo(17.088,1.048);
        ctx.bezierCurveTo(17.088,0.768,16.861,0.541,16.581,0.541);
        ctx.bezierCurveTo(16.301,0.541,16.074,0.768,16.074,1.048);
        ctx.lineTo(16.074,1.216);
        ctx.bezierCurveTo(12.035,1.19,7.997,0.86,3.986,0.226);
        ctx.bezierCurveTo(3.709,0.182,3.45,0.371,3.406,0.646);
        ctx.bezierCurveTo(3.362,0.922,3.551,1.182,3.827,1.226);
        ctx.bezierCurveTo(7.89,1.871,11.982,2.205,16.075,2.229);
        ctx.lineTo(16.075,2.974);
        ctx.lineTo(15.432,2.974);
        ctx.bezierCurveTo(15.257,2.974,15.094,3.065,15.001,3.214);
        ctx.lineTo(14.166,4.563);
        ctx.lineTo(9.74,8.209);
        ctx.lineTo(6.042,9.44);
        ctx.lineTo(2.576,5.525);
        ctx.bezierCurveTo(2.48,5.418,2.342,5.354,2.197,5.354);
        ctx.lineTo(0.507,5.354);
        ctx.bezierCurveTo(0.339,5.354,0.181,5.437,0.088,5.578);
        ctx.bezierCurveTo(-0.007,5.717,-0.026,5.893,0.036,6.05);
        ctx.lineTo(2.562,12.395);
        ctx.bezierCurveTo(2.632,12.573,2.797,12.695,2.987,12.712);
        ctx.lineTo(5.328,12.925);
        ctx.bezierCurveTo(5.425,12.934,5.522,12.914,5.608,12.868);
        ctx.lineTo(7.033,12.126);
        ctx.lineTo(12.897,12.198);
        ctx.lineTo(13.346,12.235);
        ctx.lineTo(12.739,12.919);
        ctx.bezierCurveTo(12.721,12.939,12.715,12.963,12.7,12.984);
        ctx.lineTo(10.116,12.782);
        ctx.bezierCurveTo(9.831,12.767,9.6,12.968,9.578,13.242);
        ctx.bezierCurveTo(9.556,13.518,9.762,13.759,10.037,13.78);
        ctx.lineTo(22.844,14.78);
        ctx.bezierCurveTo(22.858,14.78,22.869,14.782,22.881,14.781);
        ctx.bezierCurveTo(23.143,14.782,23.361,14.584,23.381,14.327);
        ctx.bezierCurveTo(23.404,14.045,23.197,13.804,22.922,13.782);
        ctx.lineTo(21.17,13.645);
        ctx.lineTo(20.732,12.842);
        ctx.lineTo(25.666,13.247);
        ctx.bezierCurveTo(25.680,13.247,25.693,13.249,25.707,13.249);
        ctx.bezierCurveTo(25.771,13.249,25.834,13.236,25.895,13.214);
        ctx.lineTo(29.233,11.902);
        ctx.bezierCurveTo(29.699,11.72,30,11.277,30,10.775);
        ctx.bezierCurveTo(30,10.29,29.709,9.853,29.26,9.662);
        ctx.closePath();
        ctx.moveTo(19.98,13.555);
        ctx.lineTo(13.931,13.082);
        ctx.lineTo(14.591,12.34);
        ctx.lineTo(19.54,12.746);
        ctx.lineTo(19.98,13.555);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    static drawCopter2(ctx, color) {
        ctx.beginPath();
        ctx.moveTo(29.673,12.83);
        ctx.bezierCurveTo(29.349,12.631,28.925,12.73,28.727,13.055);
        ctx.bezierCurveTo(28.724,13.061,28.358,13.621,27.63,13.621);
        ctx.lineTo(26.378,13.621);
        ctx.lineTo(26.378,12.459);
        ctx.lineTo(27.165,12.459);
        ctx.lineTo(27.165,12.459);
        ctx.bezierCurveTo(27.925,12.459,28.54,11.844,28.54,11.084);
        ctx.bezierCurveTo(28.54,11.061,28.54,11.039,28.54,11.016);
        ctx.bezierCurveTo(28.526,7.9725,27.202,5.65,24.724,4.299);
        ctx.bezierCurveTo(23.132,3.431,21.283,3.097,19.7367,2.991);
        ctx.lineTo(19.7367,1.38);
        ctx.lineTo(24.965,1.38);
        ctx.bezierCurveTo(25.344,1.38,25.653,1.071,25.653,0.692);
        ctx.bezierCurveTo(25.653,0.31194,25.344,0.004,24.965,0.004);
        ctx.lineTo(13.135,0.004);
        ctx.bezierCurveTo(12.754,0.004,12.447,0.312,12.447,0.692);
        ctx.bezierCurveTo(12.447,1.0728,12.755,1.38,13.135,1.38);
        ctx.lineTo(18.362,1.38);
        ctx.lineTo(18.362,2.95);
        ctx.bezierCurveTo(16.908,2.964,15.863,3.1340,15.818,3.14);
        ctx.bezierCurveTo(15.301,3.226,14.88,3.597,14.728,4.097);
        ctx.lineTo(13.947,6.672);
        ctx.lineTo(5.891,6.672);
        ctx.lineTo(2.455,3.854);
        ctx.bezierCurveTo(2.208,3.653,1.9,3.542,1.582,3.542);
        ctx.lineTo(1.375,3.542);
        ctx.bezierCurveTo(0.615,3.542,0,4.158,0,4.918);
        ctx.lineTo(0,8.447);
        ctx.bezierCurveTo(0,9.207,0.616,9.822,1.375,9.822);
        ctx.lineTo(12.836,9.822);
        ctx.lineTo(15.067,12.052);
        ctx.bezierCurveTo(15.325,12.312,15.675,12.456,16.041,12.456);
        ctx.lineTo(18.512,12.456);
        ctx.lineTo(18.512,13.618);
        ctx.lineTo(15.693,13.618);
        ctx.bezierCurveTo(15.313,13.618,15.005,13.927,15.005,14.307);
        ctx.bezierCurveTo(15.005,14.687,15.314,14.995,15.693,14.995);
        ctx.lineTo(27.63,14.995);
        ctx.bezierCurveTo(28.827,14.995,29.619,14.225,29.899,13.772);
        ctx.bezierCurveTo(30.097,13.453,29.995,13.029,29.673,12.83);
        ctx.closePath();
        ctx.moveTo(20.027,13.621);
        ctx.lineTo(20.027,12.459);
        ctx.lineTo(24.864,12.459);
        ctx.lineTo(24.864,13.623);
        ctx.lineTo(20.027,13.623);
        ctx.lineTo(20.027,13.621);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    static drawCopter3(ctx, color) {
        ctx.beginPath();
        ctx.moveTo(29.691,12.945);
        ctx.bezierCurveTo(29.384,12.757,28.982,12.851,28.795,13.158);
        ctx.bezierCurveTo(28.791,13.165,28.444,13.696,27.754,13.696);
        ctx.lineTo(26.566,13.696);
        ctx.lineTo(26.566,12.498);
        ctx.lineTo(27.49,12.498);
        ctx.bezierCurveTo(27.916,12.498,28.316,12.29,28.559,11.939);
        ctx.bezierCurveTo(28.802,11.589,28.861,11.143,28.714,10.743);
        ctx.bezierCurveTo(28.642,10.548,26.908,5.939,22.857,4.431);
        ctx.bezierCurveTo(22.466,4.285,21.964,4.151,21.38,4.028);
        ctx.bezierCurveTo(21.371,4,21.36,3.971,21.348,3.943);
        ctx.lineTo(20.834,2.592);
        ctx.bezierCurveTo(20.7,2.242,20.365,2.012,19.991,2.012);
        ctx.lineTo(19.73,2.012);
        ctx.lineTo(19.73,1.304);
        ctx.lineTo(24.687,1.304);
        ctx.bezierCurveTo(25.046,1.304,25.339,1.012,25.339,0.653);
        ctx.bezierCurveTo(25.339,0.294,25.046,0.002,24.687,0.002);
        ctx.lineTo(13.468,0.002);
        ctx.bezierCurveTo(13.108,0.002,12.816,0.294,12.816,0.653);
        ctx.bezierCurveTo(12.816,1.012,13.108,1.304,13.468,1.304);
        ctx.lineTo(18.426,1.304);
        ctx.lineTo(18.426,2.013);
        ctx.lineTo(18.295,2.013);
        ctx.bezierCurveTo(17.935,2.013,17.609,2.227,17.467,2.559);
        ctx.lineTo(17.096,3.422);
        ctx.bezierCurveTo(13.166,3.026,6.493,2.832,4.11,2.764);
        ctx.bezierCurveTo(3.706,2.17,3.023,1.779,2.251,1.779);
        ctx.bezierCurveTo(1.009,1.779,0,2.791,0,4.031);
        ctx.bezierCurveTo(0,5.273,1.01,6.283,2.252,6.283);
        ctx.bezierCurveTo(2.88,6.283,3.45,6.024,3.859,5.606);
        ctx.lineTo(12.341,6.921);
        ctx.bezierCurveTo(12.486,7.502,12.728,8.286,13.111,9.071);
        ctx.bezierCurveTo(14.488,11.901,16.49,12.496,17.928,12.496);
        ctx.lineTo(19.107,12.496);
        ctx.lineTo(19.107,13.694);
        ctx.lineTo(15.128,13.694);
        ctx.bezierCurveTo(14.768,13.694,14.476,13.986,14.476,14.345);
        ctx.bezierCurveTo(14.476,14.705,14.768,14.997,15.128,14.997);
        ctx.lineTo(27.753,14.997);
        ctx.bezierCurveTo(28.888,14.997,29.638,14.268,29.902,13.839);
        ctx.bezierCurveTo(30.094,13.535,29.998,13.134,29.691,12.945);
        ctx.closePath();
        ctx.moveTo(20.545,12.497);
        ctx.lineTo(25.131,12.497);
        ctx.lineTo(25.131,13.695);
        ctx.lineTo(20.545,13.695);
        ctx.lineTo(20.545,12.497);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
    }

    static drawPlayers(draw, players) {
        let i = 0;
        for (let player of players) {
            draw.save();
            draw.translate(player.x, player.y);
            draw.rotate(player.rotation);
            Painter[`drawCopter${player.copter}`](draw, player.color);
            draw.restore();
            ++i;
        }
    }
}