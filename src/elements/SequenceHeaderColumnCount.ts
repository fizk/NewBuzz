import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";

export default class SequenceHeaderColumnCount extends Node {
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
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.fillStyle = 'black';
        this.context.textBaseline = 'ideographic';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.label, 4, 16);
        this.context.restore();

        this.context.save();
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(50, 0);
        this.context.lineTo(50, this.parent.parent.height - 8);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        super.draw(x, y);
        this.context.restore();
    }
}
