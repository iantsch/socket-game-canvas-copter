import {GameScreen} from 'socket-games-api/screen';

import Screen from './Screen';

const api = new GameScreen(
    () => {
        // TODO : use socket-games-api
        top.JSCONST.onGameCreated();
        const screen = new Screen(api);
        screen.run();
    },
    error => {
        console.error('screen/index - unable to create api', error);
    }
);
