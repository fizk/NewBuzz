import Node from "../elements/Node";
import {colorShade} from "../util/color";
import {COLOR} from "../types/COLOR";

export default class Footer extends Node {
    get height() {
        return 24;
    }

    draw(x: number = 0, y: number = 0): void {
        //Border
        this.context.save();
        this.context.lineCap = "square";
        this.context.translate(0.5, 0.5);

        this.context.strokeStyle = colorShade(COLOR.WINDOWS, 0.1);
        this.context.beginPath();
        this.context.moveTo(2, this.height -2 -2);
        this.context.lineTo(2, 2);
        this.context.lineTo(this.width - 4, 2);
        this.context.stroke();


        this.context.strokeStyle = colorShade(COLOR.WINDOWS, 1.1);
        this.context.beginPath();
        this.context.moveTo(2, this.height -2 -2);
        this.context.lineTo(this.width - 4, this.height -2 -2);
        this.context.lineTo(this.width - 4, 2);
        this.context.stroke();

        this.context.restore();

        //Draw
        this.context.save();
        super.draw(x, y);
        this.context.restore();
    }
}
