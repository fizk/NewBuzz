import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import Text from "./Text";
import {Pattern} from "../types/Pattern";

export default class SequenceList extends Node {
    patterns: any[] = [];
    constructor(key: any) {
        super(key);
        this.type = NOTE_TYPE.IN_LINE;
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();
        this.context.fillStyle = '#fff';
        this.context.fillRect(2, 2, this.width-4, this.height-4);

        this.drawBorder({x:2, y:2, width: this.width-4, height: this.height-4}, true);

        this.removeChildren();
        this.patterns.forEach((pattern: Pattern) => {
            const text = new Text(pattern.label, `${pattern.index} ${pattern.label}`);
            text.type = NOTE_TYPE.BLOCK;
            this.addChild(text);
        });

        super.draw(x, y);
        this.context.restore();
    }
}
