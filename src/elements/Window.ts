import Node from '../elements/Node';
import {Point} from '../types/Point';
import {NOTE_TYPE} from "../types/NOTE_TYPE";

export default class Window extends Node {

    constructor(key: any, position: Point = {x: 0, y: 0}) {
        super(key);
        this.position = position;
        this.type = NOTE_TYPE.IN_LINE;
    }

    background(width, height) {
        this.context.save();
        this.context.fillStyle = '#d4d0c8';
        this.context.shadowColor = 'gray';
        this.context.shadowOffsetY = 2;
        this.context.shadowOffsetX = 1;
        this.context.shadowBlur = 3;
        this.context.fillRect(0, 0, width, height);

        this.context.restore();
    }

    draw(x: number = 0, y: number = 0): void {

        // this.context.save();
        // const width: number = Math.max(...this.children.map(child => {
        //     return child.width || 0;
        // }));

        this.background(this.width+4, this.height + 8);
        this.drawBorder({x: 2, y:2, width: this.width+4, height: this.height+8});

        this.context.translate(2, 4);
        super.draw(x, y);
        this.context.restore();


    }
}
