import Node from "../elements/Node";
import MachineView from "./Screens/MachineView";
import PatternView from "./Screens/PatternView";
import SequenceView from "./Screens/SequenceView";
import {View} from "../types/View";
import CustomEvent from "../types/CustomEvent";
import State from "../types/State";

export default class Stage extends Node {

    machineView: MachineView;
    patternView: PatternView;
    sequenceView: SequenceView;

    constructor(key: string, state: State) {
        super(key);
        this.stretch = true;

        this.machineView = new MachineView(String(View.Machine), state);
        this.patternView = new PatternView(String(View.Pattern), state);
        this.sequenceView = new SequenceView(String(View.Sequence), state);

        this.addEventListener('on-view-change', (event: CustomEvent) => {
            switch (event.detail.view) {
                case View.Sequence:
                    this.setChild(this.sequenceView);
                break;
                case View.Pattern:
                    this.patternView.pattern= event.detail.pattern;
                    this.setChild(this.patternView);
                break;
                case View.Machine:
                    this.setChild(this.machineView);
                break;
            }
        });
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        super.draw(x, y);
        this.context.restore();
    }
}
