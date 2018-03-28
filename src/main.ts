import Application from "./components/Application";
import checkEvents from "./util/checkEvents";
import checkKey from "./util/checkKey";
import {ModuleType} from "./types/ModuleType";
import ModuleProp from "./types/ModuleProp";
import State from "./types/State";
import NodeMap from './types/NoteMap';

const state: State = {
    modules: new Map<number, ModuleProp>(),
    sequenceNumber: 0,
    patterns: new Map(),
    sequence: [
        [], [], [], [], [], [],
        [], [], [], [], [], [],
    ],
    selectedModule: undefined,
    begin: 0,
    end: 0,
};

state.modules.set(1, {
    key: 1,
    position: { x: 200, y: 200 },
    type: ModuleType.MASTER,
    patternIndex: 0,
    label: 'Master',
    ref: [],
    mute: false,
    properties: {
        asdr: { a: 0.1, s: 0.2, d: 0, r: 0 }
    }
});

window['debugState'] = state;

const application = new Application('app', state);

document.addEventListener('DOMContentLoaded', () => {
    const audioContext = new AudioContext();

    const canvas = document.createElement('canvas');
    document.body.appendChild(canvas);
    application.context = canvas.getContext('2d');

    canvas.addEventListener('contextmenu', event => {
        event.preventDefault();
        event.stopPropagation();
        checkEvents(event, 'contextMenu', application);
        return false;
    });
    canvas.addEventListener('mousedown', event => {
        if (event.button === 0) {
            checkEvents(event, 'mouseDown', application);
        }
        return false;
    });
    canvas.addEventListener('mousemove', event => {
        if (event.button === 0) {
            checkEvents(event, 'mouseMove', application);
        }
        return false
    });
    canvas.addEventListener('mouseup', event => {
        if (event.button === 0) {
            checkEvents(event, 'mouseUp', application);
        }
        return false;
    });
    document.body.addEventListener('keyup', event => {

        if(event.keyCode === 40) {
            event.preventDefault();
            checkKey(event, 'arrowDown', application);
        } else if (event.keyCode === 38) {
            event.preventDefault();
            checkKey(event, 'arrowUp', application);
        } else if (event.keyCode === 37) {
            event.preventDefault();
            checkKey(event, 'arrowLeft', application);
        } else if (event.keyCode === 39) {
            event.preventDefault();
            checkKey(event, 'arrowRight', application);
        } else if (event.keyCode === 13) {
            event.preventDefault();
            checkKey(event, 'enter', application);
        } else if (event.keyCode == 190) {
            event.preventDefault();
            checkKey(event, 'delete', application);
        } else if (event.keyCode >= 65 || event.keyCode >= 90) {
            event.preventDefault();
            checkKey(event, 'letter', application);
        } else if (event.keyCode >= 48 || event.keyCode >= 57) {
            event.preventDefault();
            checkKey(event, 'number', application);
        }
        //
    });

    const animate = () => {
        requestAnimationFrame(animate);
        canvas.width = document.body.clientWidth;
        canvas.height = document.body.clientHeight;
        application.width = canvas.width;
        application.height = canvas.height;

        application.draw(0, 0);
    };
    animate();

    let counter = 0;
    setInterval(() => {
        const now = audioContext.currentTime;
        state.sequence[state.sequenceNumber].forEach(patternKey => {
            const pattern = state.patterns.get(patternKey);

            console.log(NodeMap[pattern.pattern[counter % 16]]);

            const node = NodeMap[pattern.pattern[counter % 16]];
            if(node) {
                const oscillator = audioContext.createOscillator();
                const gain = audioContext.createGain();
                oscillator.connect(gain);
                gain.connect(audioContext.destination);

                oscillator.frequency.value = node;
                oscillator.start(now);
                oscillator.stop(now + (0.02 + 0.2));

                gain.gain.setValueAtTime(0.01, now);
                gain.gain.exponentialRampToValueAtTime(1, now + 0.02);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
            }


        });

        counter++;

    }, 200);


});
