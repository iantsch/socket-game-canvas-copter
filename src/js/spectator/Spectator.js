import $ from 'jquery';
import qrcodejs from 'qrcodejs';

import Painter from '../game/Painter';
import {raf, caf} from '../game/Game';

export default class Spectator {

    constructor(api) {
        this._api = api;
        this.$ = {};
        this.canvas = null;
        this.context = null;
        this.data = null;
        this.lastRequest = null;

        this._onDraw = this._onDraw.bind(this);
    }

    run() {
        this.$.scores = $('.scores');
        this.$.game = $('#game-container');
        this.canvas = this.createCanvas('spectator');
        this.context = this.canvas.getContext('2d');
        Spectator.renderScreenId();
        this._api.on('draw', data => {
            if (this.lastRequest) {
                caf(this.lastRequest)
            }
            this.lastRequest = raf(this._onDraw(data));
        });

        this._api.on('toggle-fullscreen', data => {
            this.$.game.closest('.screen').toggleClass('screen--fullscreen');
        });

        this._api.on('toggle-sidebar', data => {
            this.$.game.closest('.screen').toggleClass('screen--sidebar');
        });

        this._api.on('toggle-qrcode', data => {
            this.$.game.closest('.screen').toggleClass('screen--qrcode');
        });

        this._api.on('update-scores', html => {
            this.$.scores.html(html);
        });
    };

    createCanvas(canvasId) {
        const canvas = document.createElement("canvas");
        canvas.id = canvasId;
        this.$.game.append(canvas);
        this.$.spectator = this.$.game.find(`#${canvasId}`);
        return canvas;
    }

    _onDraw(data) {
        data.gameData.context = this.context;
        this.canvas.width = data.gameData.canvas.width;
        this.canvas.height = data.gameData.canvas.height;
        this.data = data;
        Painter.draw(data.gameData);

        this.$.spectator.css({transform: ''});
        let scaleWidth = 1 / this.canvas.width * this.$.game.width();
        let scaleHeight = 1 / this.canvas.height * this.$.game.height();
        let scale = 1;
        if (scaleWidth === 1 && scaleHeight === 1) {
            return;
        }
        if (scaleWidth > 1) {
            scale = scaleHeight > scaleWidth ? scaleHeight : scaleWidth;
        }
        if (scaleWidth < 1) {
            scale = scaleHeight < scaleWidth ? scaleHeight : scaleWidth;
        }
        this.$.spectator.css({transform: `scale(${scale})`});
        this.lastRequest = null;
    }

    static renderScreenId() {
        // ATTENTION: this method has a duplicate in gamecenter MainView
        const $controller= $('.link--controller');
        const $spectator = $('.link--spectator');
        const controllerUrl = top.JSCONST.gameCenterControllerUrl;
        const spectatorUrl = top.location.href;
        $controller.attr('href', controllerUrl).find('.link__label').empty().text(controllerUrl);
        $spectator.attr('href', spectatorUrl).find('.link__label').empty().text(spectatorUrl);
        new qrcodejs.QRCode($('.qrcode')[0], {
            width: 230,
            height: 230,
            text: controllerUrl
        });
    }
};
