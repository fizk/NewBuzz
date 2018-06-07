import Node from "../elements/Node";
import Button from "../elements/Button";
import Block from "../elements/Block";
import Text from "../elements/Text";
import WindowsToolbar from "./WindowsToolbar";
import WindowsHeaderStrip from "./WindowsHeaderStrip";
import WindowsDivider from "./WindowsDivider";
import ImageButton from "../elements/ImageButton";
import {View} from "../types/View";
import sprite from "../util/sprite";
import {ViewChangeRequest} from "../types/CustomEvent";
import CustomEvent from "../types/CustomEvent";

export default class Header extends Node {

    constructor() {
        super();
        //System buttons
        const fileButton = new Text('file', 'File');
        const editButton = new Text('edit', 'Edit');
        const helpButton = new Text('help', 'Help');

        const systemButtonContainer = new Block().addChildren([
            new WindowsToolbar().addChildren([fileButton, editButton, helpButton]),
        ]);

        //Application buttons
        const img = new Image();
        img.src = sprite;

        const newButton = new Button('', 'New');
        const openButton = new Button('', 'Open');
        const saveButton = new Button('', 'Save');

        const actionButtons = [newButton, openButton, saveButton];

        const playButton = new ImageButton('Play', img, {x: 0, y: 16, width: 16, height: 16});
        const recButton = new ImageButton('Rec', img, {x: 16, y: 16, width: 16, height: 16});
        const stopButton = new ImageButton('Stop', img, {x: 32, y: 16, width: 16, height: 16});
        const loopButton = new ImageButton('Loop', img, {x: 48, y: 16, width: 16, height: 16});

        const controlButtons = [playButton, recButton, stopButton, loopButton];

        const patternButton = new ImageButton('Pattern View', img, {x: 0, y: 0, width: 16, height: 16});
        const machineButton = new ImageButton('Machine View', img, {x: 32, y: 0, width: 16, height: 16});
        const sequenceButton = new ImageButton('Sequence View', img, {x: 16, y: 0, width: 16, height: 16});

        const viewButtons = [patternButton, machineButton, sequenceButton];

        patternButton.addEventListener('mouseUp', () => this.fire('on-viewChange', {view: View.Pattern}));
        machineButton.addEventListener('mouseUp', () => this.fire('on-viewChange', {view: View.Machine}));
        sequenceButton.addEventListener('mouseUp', () => this.fire('on-viewChange', {view: View.Sequence}));

        this.addEventListener('on-viewChange', (event: CustomEvent<ViewChangeRequest>) => {
            patternButton.active = event.detail.view === View.Pattern;
            machineButton.active = event.detail.view === View.Machine;
            sequenceButton.active = event.detail.view === View.Sequence;
        });

        const applicationButtonContainer = new Block().addChildren([
            new WindowsToolbar().addChildren(actionButtons),
            new WindowsToolbar().addChildren(controlButtons),
            new WindowsToolbar().addChildren(viewButtons),
        ]);

        //Monitor strip
        const monitorContainer = new Block().addChildren([
            new WindowsToolbar().addChildren([
                new Text('', 'Elapsed 00:00:00:0'),
                new Text('', 'Current 00:00:00:0'),
                new Text('', 'Loop 00:00:00:0'),
            ]),
            new WindowsToolbar().addChildren([
                new Text('', 'Volume'),
                new Text('', 'BPM'),
                new Text('', 'TPB'),
            ]),
        ]);

        this.addChildren([
            new WindowsHeaderStrip(),
            systemButtonContainer,
            new WindowsDivider(),
            applicationButtonContainer,
            new WindowsDivider(),
            monitorContainer,
        ]);
    }
}
