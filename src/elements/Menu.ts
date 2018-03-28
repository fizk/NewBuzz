import Node from "./Node";
import {COLOR} from "../types/COLOR";
import {Point} from "../types/Point";

export default class Menu extends Node {
    constructor(key: any, position: Point) {
        super(key);
        this.absolute = true;
        this.position = position;
    }

    get width() {
        return 200;
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = COLOR.PANEL;


        this.context.shadowColor = 'rgba(0,0,0,0.3)';
        this.context.shadowOffsetY = 2;
        this.context.shadowOffsetX = 2;
        this.context.shadowBlur = 5;

        this.context.fillRect(0, 0, this.width, this.height);

        this.context.restore();

        this.drawBorder({x: 0, y: 0, width: this.width, height: this.height});

        this.context.save();
        super.draw(x, y);
        this.context.restore();
    }
}
