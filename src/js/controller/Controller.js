import $ from 'jquery';

export default class Controller {
    constructor(api) {
        this._api = api;
        this._goingUp = false;
        this._player = {
            id: -1,
            color: null,
            username : localStorage.getItem('username')
        };
        this.$ = {
            move : $('.move'),
            exit : $('.exit'),
            refreshColor : $('.refreshColor'),
            totalDistance : $('.distance__total'),
            maxDistance : $('.distance__max'),
        };
        if (typeof this._player.username !== 'string') {
            this._player.username = 'Guest';
        }
    }

    run() {
        this._api.emit('copter-player-join', {
            username: this._player.username
        },(data) => {
            this._player.color = data.color;
            $('body').css({
                borderColor : this._player.color,
                color : this._player.color
            });
            this.$.exit.css({
                background : this._player.color
            });
            this.$.refreshColor.css({
                background : this._player.color
            });
            this._player.id = data.playerId;
            this._emitDirection();
            this._api.on(`copter-${data.playerId}-tick`, data => {
                this.$.totalDistance.empty().html(Math.floor(data.totalDistance/10));
                this.$.maxDistance.empty().html(Math.floor(data.maxDistance/10));
            });
        });

        $(top.document).on('keydown', event => {
            if (event.keyCode === 32) {
                this._emitUp();
            }
        });

        $(top.document).on('keyup', event => {
            if (event.keyCode === 32) {
                this._emitRelease();
            }
        });


        this.$.move.on('mousedown touchstart', event => {
            event.preventDefault();
            event.stopPropagation();
            this._emitUp();
        }).on('mouseup touchend', event => {
            event.preventDefault();
            event.stopPropagation();
            this._emitRelease();
        });

        this.$.exit.on('mousedown touchstart', event => {
            this.$.exit.addClass('pressed');
        }).on('mouseup touchend', event => {
            this.$.exit.removeClass('pressed');
        }).on('click', event => {
            event.preventDefault();
            if (confirm('really?')) {
                this._api.emit('copter-exit');
            }
        });
        this.$.refreshColor.on('mousedown touchstart', event => {
            this.$.refreshColor.addClass('pressed');
        }).on('mouseup touchend', event => {
            this.$.refreshColor.removeClass('pressed');
        }).on('click', event => {
            event.preventDefault();
            this._api.emit('copter-refresh-color', {
                playerId : this._player.id
            }, (data) => {
                this._player.color = data.color;
                $('body').css({
                    borderColor : this._player.color,
                    color: this._player.color
                });
                this.$.exit.css({
                    background : this._player.color
                });
                this.$.refreshColor.css({
                    background : this._player.color
                });
            });
        });

        this._api.on('screen-exit', () => top.JSCONST.stopGame());
        this._api.on('screen-disconnected', () => {top.JSCONST.stopGame();});
    };
    
    _emitUp() {
        $('.move').addClass('pressed');
        this._goingUp = true;
        this._emitDirection();
    }
    _emitRelease() {
        $('.move').removeClass('pressed');
        this._goingUp = false;
        this._emitDirection();
    }
    _emitDirection() {
        let event = this._goingUp ? 'copter-up' : 'copter-release';
        this._api.emit(event, {playerId: this._player.id});
    }

}
