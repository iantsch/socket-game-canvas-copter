import $ from 'jquery';
import qrcodejs from 'qrcodejs';

import Game, {raf} from '../game/Game';

export default class Screen {

    constructor(api) {
        this._api = api;
        this._players = {};
        this._ranking = [];
        this.$ = {};
        this._game = null;
        this._resizing = {
            start : Date.now(),
            duration : 250
        }
    }

    run() {
        Screen.renderScreenId();

        this.$.game = $('#game-container');
        this.$.scores = $('.scores');
        this._game = new Game('jsCopter', 'game-container', {
            canvas: {
                width: this.$.game.outerWidth(),
                height: this.$.game.outerHeight(),
                refreshRate: 20,
                topSpeed: 7
            }
        });

        this._game.setRoundCallback(this._onRoundCallback);
        this._game.setCollisionCallback(this._onCollisionCallback);
        this._game.setTickCallback(this._onTick);

        $(window).on('resize', this._onWindowResize);
        window.jsCopter = this._game;

        $('.toggle-fullscreen').on('click', event => {
            event.preventDefault();
            this._resizing.start = Date.now();
            raf(this._resizeCanvas);
            this.$.game.closest('.screen__wrapper')
                .toggleClass('screen__wrapper--fullscreen');
        });

        $('.toggle-sidebar').on('click', event => {
            event.preventDefault();
            this.$.game.parent().toggleClass('screen__wrapper--sidebar');
        });

        this._api.on('copter-player-join', (data, callback) => {
            const playerId = this._game.addPlayer(new Date().getTime() + '');
            const player = {
                id: playerId,
                score: 0,
                totalDistance: 0,
                maxDistance: 0,
                color: this._game.playerManager.getPlayerColor(playerId),
                username: data.username
            };
            this._players[data.controllerId] = player;
            this._ranking.push(data.controllerId);

            if (!this._game.gameData.running) {
                this._game.startGame();
                this.$.game.find('h2').remove();
            }
            callback({
                playerId: playerId,
                color: player.color
            });
            const $li = $(
                `<li data-playerId="${playerId}" class="scores__item">
                    <span class="playerColor" style="background-color: ${player.color}"></span>
                    ${player.username} :
                    <svg class="score__svg svg" viewBox="52.405 123.305 490.472 595.279">
                        <path d="M406.738,382.471c48.075-15.814,136.139-79.187,136.139-163.505c0-41.272-35.282-74.742-77.019-71.396
                            c0.1-2.823,0.25-5.622,0.292-8.452c0-4.186-1.582-8.186-4.558-11.161c-2.976-3.071-6.976-4.651-11.161-4.651H144.885
                            c-4.186,0-8.186,1.58-11.161,4.651c-2.976,2.976-4.558,6.976-4.558,11.161c0.041,2.791,0.11,5.599,0.195,8.453
                            c-41.724-3.292-76.957,30.142-76.957,71.396c0,84.338,88.106,147.721,136.174,163.515c18.061,29.867,38.676,51.468,61.225,64.135
                            c-1.768,6.696-2.045,12.742-2.045,12.835c0,0.279,1.022,16.371,8.37,24.371v23.159c-21.044,5.8-35.086,15.618-39.939,27.532h-27.96
                            c-5.208,0-9.301,4.185-9.301,9.301v131.055h-6.791c-5.208,0-9.301,4.185-9.301,9.301v25.113c0,5.117,4.093,9.301,9.301,9.301
                            h251.041c5.116,0,9.301-4.184,9.301-9.301V684.17c0-5.116-4.185-9.301-9.301-9.301h-6.789V543.814c0-5.117-4.186-9.301-9.301-9.301
                            h-28.043c-4.829-11.914-18.812-21.732-39.856-27.532v-22.975c7.255-7.906,8.37-24.276,8.37-24.556c0-0.093-0.371-6.138-2.045-12.742
                            C368.065,433.95,388.597,412.341,406.738,382.471z M71.006,218.966c0-29.293,23.835-53.127,53.128-53.127
                            c1.99,0,4.025,0.14,6.086,0.393c0.177,3.208,0.315,6.417,0.525,9.624c4.504,68.036,19.678,130.295,43.562,180.232
                            C132.203,334.461,71.006,283.827,71.006,218.966z M464.568,175.855c0.207-3.147,0.404-6.338,0.578-9.63
                            c2.031-0.247,4.039-0.388,6-0.388c29.294,0,53.128,23.834,53.128,53.128c0,64.838-61.153,115.46-103.26,137.102
                            C444.892,306.135,459.973,243.882,464.568,175.855z"/>
                    </svg>
                    <span class="score">${ player.score}</span>
                    <svg class="distance__svg svg" viewBox="0 0 423.085 553.218">
                        <path d="M377.477,342.563c29.865-37.761,45.608-83.035,45.608-131.025C423.085,94.898,328.188,0,211.543,0S0,94.898,0,211.538
                            c0,47.99,15.743,93.265,45.528,130.928l166.01,210.752L377.477,342.563z M148.478,211.538c0-34.773,28.288-63.061,63.061-63.061
                            c34.773,0,63.061,28.292,63.061,63.061c0,34.773-28.287,63.062-63.061,63.062C176.77,274.6,148.478,246.312,148.478,211.538z"/>
                    </svg>
                    <span class="maxDistance">${player.maxDistance}</span>
                </li>`
            );
            this.$.scores.find('ul').append($li);
        });

        this._api.on('controller-disconnected', data => {
            const playerId = this._players[data.controllerId].id,
                rankingIndex = this._ranking.indexOf(playerId);
            this._game.removePlayer(playerId);
            if (rankingIndex > -1) {
                this._ranking.splice(rankingIndex, 1);
            }
            delete this._players[data.controllerId];
            $(`li[data-playerId="${playerId}"]`).remove();
            if (Object.keys(this._players).length > 0) {
                return;
            }
            this._game.endGame();
            setTimeout(() => {
                this._api.emit('screen-exit');
                top.JSCONST.stopGame();
            }, 10);
        });

        this._api.on('copter-exit', function () {
            setTimeout(() => {
                this._api.emit('screen-exit');
                top.JSCONST.stopGame();
            }, 10);
        });

        this._api.on('copter-up', data => {
            const playerId = Number(data.playerId);
            this._game.handleControl(playerId, true);
        });

        this._api.on('copter-release', data => {
            const playerId = Number(data.playerId);
            this._game.handleControl(playerId, false);
        });

        this._api.on('copter-refresh-color', (data, callback) => {
            const playerId = Number(data.playerId),
                color = this._game.playerManager.getColor();
            this._game.playerManager.players[playerId].color = color;
            callback({
                color: color
            });
            $(`[data-playerId="${playerId}"] > span.playerColor`).css('backgroundColor', color);
        });



    };

    _resizeCanvas() {
        this._onWindowResize();
        this._game.gameData.running = false;
        this._game.createBG();
        this._game.createInitialWalls();
        if (( Date.now() - this._resizing.start ) < this._resizing.duration) {
            raf(this._resizeCanvas);
        } else if (this._game.playerManager.numberOfPlayers() > 0) {
            this._game.callback.round();
            this._game.startGame();
        }
    }

    _updateStats() {
        if (this._ranking.length > 1) {
            this._ranking.sort((controllerIdA, controllerIdB) => {
                if (
                    this._players.hasOwnProperty(controllerIdA) &&
                    this._players.hasOwnProperty(controllerIdB) &&
                    this._players[controllerIdA].score > this._players[controllerIdB].score) {
                    return -1;
                } else if (
                    this._players.hasOwnProperty(controllerIdA) &&
                    this._players.hasOwnProperty(controllerIdB) &&
                    this._players[controllerIdA].score < this._players[controllerIdB].score
                ) {
                    return 1;
                } else {
                    return 0;
                }
            });
        }
        for (let controllerId of this._ranking) {
            if (this._players.hasOwnProperty(controllerId)) {
                const player = players[controllerId];
                const $li = $(`[data-playerId="${player.id}"]`);
                if (!this._game.playerManager.players[player.id].isAlive) {
                    $li.addClass('scores__item--is-dead');
                }
                $li.find('.score').empty().text(player.score);
                $li.find('.maxDistance').empty().text(player.maxDistance);
                $li.detach().appendTo(this.$.scores.find('ul'));
            }
        }
    }

    _onRoundCallback() {
        this._updateStats();
        $('.scores__item--is-dead').removeClass('scores__item--is-dead');
    }

    _onCollisionCallback() {
        for (let controllerId of Object.keys(players)) {
            const player = this._players[controllerId];
            if (this._game.playerManager.players[player.id].isAlive) {
                ++player.score;
            } else {
                player.totalDistance = Math.floor(this._game.playerManager.players[player.id].totalDistance / 10);
                player.maxDistance = Math.floor(this._game.playerManager.players[player.id].maxDistance / 10);
            }
        }
        this._updateStats();
    }

    _onWindowResize() {
        this._game.updateCanvas({
            width: this.$.game.outerWidth(),
            height : this.$.game.outerHeight()
        });
    }

    _onTick(playerId) {
        this._api.emit('copter-tick', {
            totalDistance : this._game.playerManager.players[playerId].totalDistance,
            maxDistance : this._game.playerManager.players[playerId].maxDistance
        });
    }

    static renderScreenId() {
        // ATTENTION: this method has a duplicate in gamecenter MainView
        let $screenId = $('.controller-link');
        let url = top.JSCONST.gameCenterControllerUrl;
        $screenId.html(`<a href="${url}" target="_blank">${url}</a>`);
        new QRCode($('.qrcode')[0], url);
    }

};
