import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";

export default class SequenceEditor extends Node {


    constructor(key: any) {
        super(key);
        this.type = NOTE_TYPE.IN_LINE;
        this.stretch = true;
    }


    draw(x: number = 0, y: number = 0): void {

        this.drawBorder({x:2, y:2, width: this.width-4, height: this.height-4}, true);
        this.context.save();
        this.context.translate(4, 4);
        super.draw(x, y);
        this.context.restore();
    }
}
