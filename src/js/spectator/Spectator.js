import $ from 'jquery';

import Painter from '../game/Painter';

export default class Spectator {

    constructor(api) {
        this._api = api;
        this.$ = {};
        this.canvas = null;
        this.context = null;
    }

    run() {
        this.$.game = $('#game-container');
        this.canvas = this.createCanvas('multiscreen');
        this.context = this.canvas.getContext('2d');
        this._api.on('draw', data => {
            data.gameData.context = this.context;
            this.canvas.width = data.gameData.canvas.width;
            this.canvas.height = data.gameData.canvas.height;
            Painter.draw(data.gameData);
        });
    };

    createCanvas(canvasId) {
        const canvas = document.createElement("canvas");
        canvas.id = canvasId;
        this.$.game.append(canvas);
        return canvas;
    }
};
