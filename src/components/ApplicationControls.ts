import Node from "../elements/Node";
import {Bar} from "../elements/Bar";
import Button from "../elements/Button";
import {View} from "../types/View";
import ImageButton from "../elements/ImageButton";
import sprite from '../util/sprite';
import CustomEvent from "../types/CustomEvent";

export default class ApplicationControls extends Node {

    private viewButtons: Button[];
    private controlButtons: Button[];

    constructor(key: string) {
        super(key);

        const img = new Image();
        img.src = sprite;

        const playButton = new ImageButton('play', 'Play', img, {x: 0, y: 16, width: 16, height: 16});
        const recButton = new ImageButton('rec', 'Rec', img, {x: 16, y: 16, width: 16, height: 16});
        const stopButton = new ImageButton('stop', 'Stop', img, {x: 32, y: 16, width: 16, height: 16});
        const loopButton = new ImageButton('loop', 'Loop', img, {x: 48, y: 16, width: 16, height: 16});

        this.controlButtons = [playButton, recButton, stopButton, loopButton];

        const patternButton = new ImageButton(View.Pattern, 'Pattern View', img, {x: 0, y: 0, width: 16, height: 16});
        const machineButton = new ImageButton(View.Machine, 'Machine View', img, {x: 32, y: 0, width: 16, height: 16});
        const sequenceButton = new ImageButton(View.Sequence, 'Sequence View', img, {x: 16, y: 0, width: 16, height: 16});

        patternButton.addEventListener('mouseUp', () => this.fire('on-view-change', {view: View.Pattern}));
        machineButton.addEventListener('mouseUp', () => this.fire('on-view-change', {view: View.Machine}));
        sequenceButton.addEventListener('mouseUp', () => this.fire('on-view-change', {view: View.Sequence}));

        this.viewButtons = [patternButton, machineButton, sequenceButton];

        const bar = new Bar('bar');
        this.addChild(bar);
        bar.addChildren(this.controlButtons);
        bar.addChildren(this.viewButtons);

        this.addEventListener('on-view-change', (event: CustomEvent) => {
            this.viewButtons.forEach((button: Button) => {
                button.active = button.key === event.detail.view;
            })
        });
    }
}
