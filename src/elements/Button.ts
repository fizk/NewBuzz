import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import Text from "./Text";
import {COLOR} from "../types/COLOR";

export default class Button extends Node {
    text: string;
    active: boolean = false;

    constructor(key: any, text: string) {
        super(key);
        this.type = NOTE_TYPE.IN_LINE;
        this.text = text;
    }

    get width(): number {
        return new Text('text', this.text).width;
    }

    get height(): number {
        return 28;
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();

        this.context.save();
        this.context.fillStyle = COLOR.TEXT;
        this.context.textBaseline = 'ideographic';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.text, 4, 19);
        this.context.restore();

        if (this.active) {
            this.drawBorder({x: 2, y: 2, width: this.width-2, height: this.height-6}, true);
        }

        super.draw(x, y);

        this.context.restore();
    }
}
