import {GameController} from 'socket-games-api/controller';

import Spectator from './Spectator';

const api = new GameController(
    () => {
        const screen = new Spectator(api);
        screen.run();
    },
    error => {
        console.error('screen/index - unable to create api', error);
    }
);
