
import ColorManager from './ColorManager';
import Player from './Player';

export default class PlayerManager {
    constructor(config, drawContext) {
        this.config = config;
        this.drawContext = drawContext;
        this.players = [];
        this.colorManager = new ColorManager();
    }

    addPlayer(name) {
        const newPlayer = new Player(this.drawContext);

        newPlayer.name = name;
        newPlayer.color = this.getColor();

        newPlayer.ID = this.players.length;

        return this.playerPush(newPlayer);
    }

    playerPush(newPlayer) {
        let i = 0
        for (let player of this.players) {
            if (player.canceled) {
                this.players[i] = newPlayer;
                return i;
            }
            ++i;
        }

        this.players.push(newPlayer);

        return this.players.length - 1;
    };

    removePlayer(playerID) {
        this.getPlayerByID(playerID).canceled = true;
    }

    initializePlayers() {
        for (let player of this.players) {
            player.x = 0;
            player.y = this.config.canvas.height/2;
            player.rotation = 0;
            player.isPlaying = true;
            player.isAlive = true;
        }
    }

    getColor() {
        return ColorManager.convertRGBToHex(this.colorManager.getColor());
    }

    navigatePlayer(playerID, direction) {
        const player = this.getPlayerByID(playerID);
        if (!player) {
            return;
        }
        player.navigate(direction);
    }

    numberOfPlayersAlive() {
        let count = 0;

        for (let player of this.players) {
            if (player.isAlive && !player.canceled) {
                count++;
            }
        }

        return count;
    }

    numberOfPlayers() {
        let count = 0;

        for (let player of this.players) {
            if (!player.canceled) {
                count++;
            }
        }

        return count;
    }

    resetScores() {
        for (let player of this.players) {
            player.wins = 0;
            player.totalDistance = 0;
        }
    }

    getPlayerByID(playerID) {
        return this.players[playerID];
    }

    getPlayerName(playerID) {
        return this.players[playerID].name;
    }

    getPlayerTotalDistance(playerID) {
        return this.players[playerID].totalDistance;
    }

    getPlayerColor(playerID) {
        return this.players[playerID].color;
    }

    getPlayerWins(playerID) {
        return this.players[playerID].wins;
    }

    getAlivePlayers() {
        const alivePlayers = [];

        for (let player of this.players) {
            if (player.isAlive && !player.canceled) {
                alivePlayers.push(player.ID);
            }
        }

        return alivePlayers;
    }
}
