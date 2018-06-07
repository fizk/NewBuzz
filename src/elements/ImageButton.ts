import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import {Dimension} from "../types/Dimension";
import {colorShade} from "../util/color";
import {COLOR} from "../types/COLOR";

export default class ImageButton extends Node {
    text: string;
    active: boolean = false;
    image: HTMLImageElement;
    dim: Dimension = {x: 0, y: 0, width: 16, height: 16};

    constructor(text: string, imgSrc:HTMLImageElement, dimensions: Dimension) {
        super();
        this.type = NOTE_TYPE.IN_LINE;
        this.text = text;
        this.nodeHeight = 19;
        this.image = imgSrc;
        this.dim = dimensions;
    }

    get width(): number {
        return 30;
    }

    get height(): number {
        return 28;
    }

    draw(x: number = 0, y: number = 0): void {

        if (this.active) {
            console.log('active');
            this.context.save();

            this.context.lineCap = "square";
            this.context.translate(-0.5, -0.5);

            this.context.strokeStyle = colorShade(COLOR.WINDOWS, 0.1);
            this.context.beginPath();
            this.context.moveTo(4, this.height - 4);
            this.context.lineTo(4, 4);
            this.context.lineTo(this.width - 4, 4);
            this.context.stroke();

            this.context.strokeStyle = colorShade(COLOR.WINDOWS, 1.1);
            this.context.beginPath();
            this.context.moveTo(4, this.height - 4);
            this.context.lineTo(this.width - 4, this.height - 4);
            this.context.lineTo(this.width - 4, 4);
            this.context.stroke();

            this.context.restore();
        }
        this.context.save();

        // this.drawBorder({x: 2, y: 2, width: this.width-2, height: this.height-6}, this.active);

        // this.context.translate(-0.5, -0.5);
        this.context.drawImage(
            this.image,
            this.dim.x,
            this.dim.y,
            this.dim.width,
            this.dim.height,
            6, 4, 16, 16
        );

        super.draw(x, y);
        this.context.restore();
    }
}
