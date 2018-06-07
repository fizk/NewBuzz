// import Application from "./components/Application";
// import checkEvents from "./util/checkEvents";
// import checkKey from "./util/checkKey";
// import {ModuleType} from "./types/ModuleType";
// import ModuleProp from "./types/ModuleProp";
// import State from "./types/State";
// import NodeMap from './types/NoteMap';
//
// const state: State = {
//     modules: new Map<number, ModuleProp>(),
//     sequenceNumber: 0,
//     patterns: new Map(),
//     sequence: [
//         [], [], [], [], [], [],
//         [], [], [], [], [], [],
//     ],
//     selectedModule: undefined,
//     begin: 0,
//     end: 0,
// };
//
// state.modules.set(1, {
//     key: 1,
//     position: { x: 200, y: 200 },
//     type: ModuleType.MASTER,
//     patternIndex: 0,
//     label: 'Master',
//     ref: [],
//     mute: false,
//     properties: {
//         asdr: { a: 0.1, s: 0.2, d: 0, r: 0 }
//     }
// });
//
// window['debugState'] = state;
//
// const application = new Application('app', state);
//
// document.addEventListener('DOMContentLoaded', () => {
//     const audioContext = new AudioContext();
//
//     const canvas = document.createElement('canvas');
//     document.body.appendChild(canvas);
//     application.context = canvas.getContext('2d');
//
//     canvas.addEventListener('contextmenu', event => {
//         event.preventDefault();
//         event.stopPropagation();
//         checkEvents(event, 'contextMenu', application);
//         return false;
//     });
//     canvas.addEventListener('mousedown', event => {
//         if (event.button === 0) {
//             checkEvents(event, 'mouseDown', application);
//         }
//         return false;
//     });
//     canvas.addEventListener('mousemove', event => {
//         if (event.button === 0) {
//             checkEvents(event, 'mouseMove', application);
//         }
//         return false
//     });
//     canvas.addEventListener('mouseup', event => {
//         if (event.button === 0) {
//             checkEvents(event, 'mouseUp', application);
//         }
//         return false;
//     });
//     document.body.addEventListener('keyup', event => {
//
//         if(event.keyCode === 40) {
//             event.preventDefault();
//             checkKey(event, 'arrowDown', application);
//         } else if (event.keyCode === 38) {
//             event.preventDefault();
//             checkKey(event, 'arrowUp', application);
//         } else if (event.keyCode === 37) {
//             event.preventDefault();
//             checkKey(event, 'arrowLeft', application);
//         } else if (event.keyCode === 39) {
//             event.preventDefault();
//             checkKey(event, 'arrowRight', application);
//         } else if (event.keyCode === 13) {
//             event.preventDefault();
//             checkKey(event, 'enter', application);
//         } else if (event.keyCode == 190) {
//             event.preventDefault();
//             checkKey(event, 'delete', application);
//         } else if (event.keyCode >= 65 || event.keyCode >= 90) {
//             event.preventDefault();
//             checkKey(event, 'letter', application);
//         } else if (event.keyCode >= 48 || event.keyCode >= 57) {
//             event.preventDefault();
//             checkKey(event, 'number', application);
//         }
//         //
//     });
//
//     const animate = () => {
//         requestAnimationFrame(animate);
//         canvas.width = document.body.clientWidth;
//         canvas.height = document.body.clientHeight;
//         application.width = canvas.width;
//         application.height = canvas.height;
//
//         application.draw(0, 0);
//     };
//     animate();
//
//     let counter = 0;
//     setInterval(() => {
//         const now = audioContext.currentTime;
//         state.sequence[state.sequenceNumber].forEach(patternKey => {
//             const pattern = state.patterns.get(patternKey);
//
//             console.log(NodeMap[pattern.pattern[counter % 16]]);
//
//             const node = NodeMap[pattern.pattern[counter % 16]];
//             if(node) {
//                 const oscillator = audioContext.createOscillator();
//                 const gain = audioContext.createGain();
//                 oscillator.connect(gain);
//                 gain.connect(audioContext.destination);
//
//                 oscillator.frequency.value = node;
//                 oscillator.start(now);
//                 oscillator.stop(now + (0.02 + 0.2));
//
//                 gain.gain.setValueAtTime(0.01, now);
//                 gain.gain.exponentialRampToValueAtTime(1, now + 0.02);
//                 gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
//             }
//
//
//         });
//
//         counter++;
//
//     }, 200);
//
//
// });


import EventManager from "./util/EventManager";
import Node from './elements/Node';
import State from "./types/State";
import ModuleProp from "./types/ModuleProp";
import Application from "./components/Application";
import {ModuleType} from "./types/ModuleType";
import checkEvents from "./util/checkEvents";
import checkKey from "./util/checkKey";
import CustomEvent, {ModuleConnectionRequest, ModuleCreateRequest, ViewChangeRequest} from "./types/CustomEvent";
import {View} from "./types/View";


const canvas = document.createElement('canvas');
document.body.appendChild(canvas);
canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

//     const patternKey = (new Date().getTime() * 2);
//     this.state.patterns.set(patternKey, {
//         key: patternKey,
//         gen: moduleKey,
//         index: 0,
//         label: '00',
//         pattern: [
//             undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
//             undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
//         ]
//     });
//
//     if(this.state.sequence[this.state.sequenceNumber] === undefined) {
//         this.state.sequence.push([patternKey]);
//     } else {
//         this.state.sequence[this.state.sequenceNumber].push(patternKey);
//         // this.state.sequence[Math.floor(Math.random() * this.state.sequence.length-1) + 1 ].push(patternKey)
//     }


const state: State = {
    modules: new Map<number, ModuleProp>(),
    sequenceNumber: 0,
    patterns: new Map(),
    sequence: [
        [], [], [], [],
        [], [], [], [],
        [], [], [], [],
    ],
    begin: 0,
    end: 0,
};


window['debugState'] = state;


const eventManager = new EventManager();
/**
 * ON-MODULE-CREATE
 */
eventManager.register('on-moduleCreate', (event: CustomEvent<ModuleCreateRequest>) => {
    const moduleProp: ModuleProp = {
        key: (new Date().getTime() * 2) * Math.random(),
        position: event.detail.position,
        type: event.detail.type,
        patternIndex: 0,
        label: event.detail.label,
        ref: [],
        mute: false,
        properties: {
            asdr: { a: 0.1, s: 0.2, d: 0, r: 0 }
        }
    };
    state.modules.set(moduleProp.key, moduleProp);
    eventManager.fire('on-addModule', Object.assign({}, moduleProp));
});

/**
 * ON-MODULE-CONNECT
 */
eventManager.register('on-moduleConnect', (event: CustomEvent<ModuleConnectionRequest>) => {
    //@todo validate that connection can be made.
    const currentState = state.modules.get(event.detail.to);
    state.modules.set(
        event.detail.to,
        Object.assign(currentState, {ref: [...currentState.ref, event.detail.from]})
    );

    eventManager.fire('on-connectModule', <ModuleConnectionRequest> {
        from: event.detail.from,
        to: event.detail.to,
    })
});

/**
 * ON-VIEW-CHANGE
 */
eventManager.register('on-viewChange', (event: CustomEvent<ViewChangeRequest>) => {});


Node.eventManager = eventManager;

const application = new Application('app', state);
application.context = canvas.getContext('2d');
application.width = canvas.width - 1;
application.height = canvas.height - 1;

eventManager.callback = () => application.draw(0, 0);

application.draw(0, 0);

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


eventManager.fire('on-viewChange', <ViewChangeRequest>{
    view: View.Machine
});

setTimeout(() => {
    const master: ModuleProp = {
        key: 1,
        position: { x: 200, y: 200 },
        type: ModuleType.MASTER,
        patternIndex: 0,
        label: 'Master',
        ref: [],
        mute: false,
        properties: undefined
    };

    state.modules.set(master.key, master);

    eventManager.fire('on-addModule', Object.assign({}, master));


}, 10);
