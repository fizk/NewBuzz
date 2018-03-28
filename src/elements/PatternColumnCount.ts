import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";

export default class PatternColumnCount extends Node {
    label: string;
    hightlight: boolean = false;

    constructor(key: any, label) {
        super(key);
        this.type = NOTE_TYPE.IN_LINE;
        this.label = label;
    }

    get height() {
        return 20;
    }

    get width() {
        return 50;
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();

        this.context.fillStyle = this. hightlight ? '#bdb5a0' : '#dad6ca';
        this.context.fillRect(0, 0, 50, 20);

        this.context.fillStyle = 'black';
        this.context.textBaseline = 'ideographic';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.label, 4, 16);

        this.context.restore();

        super.draw(x, y);
    }
}
