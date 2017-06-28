import {GameController} from 'socket-games-api/controller';

import Controller from './Controller';

const api = new GameController(
    () => {
        const controller = new Controller(api);
        controller.run();
    },
    error => {
        console.error('controller/index - unable to create api', error);
    }
);
