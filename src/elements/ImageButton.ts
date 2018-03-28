import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import {Dimension} from "../types/Dimension";

export default class ImageButton extends Node {
    text: string;
    active: boolean = false;
    image: HTMLImageElement;
    dim: Dimension = {x: 0, y: 0, width: 16, height: 16};

    constructor(key: any, text: string, imgSrc:HTMLImageElement, dimensions: Dimension) {
        super(key);
        this.type = NOTE_TYPE.IN_LINE;
        this.text = text;
        this.nodeHeight = 19;
        this.image = imgSrc;
        this.dim = dimensions;
    }

    get width(): number {
        return 28;
    }

    get height(): number {
        return 28;
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();

        this.drawBorder({x: 2, y: 2, width: this.width-2, height: this.height-6}, this.active);

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
