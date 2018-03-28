import Node from './Node';

export default class MenuItem extends Node {
    label: string;

    constructor(key: any, label: string) {
        super(key);
        this.label = label;
    }

    get height() {
        return 20;
    }

    get width() {
        return 200;
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = 'black';
        this.context.font = '11px sans-serif';
        this.context.fillText(this.label, 6, 15);

        super.draw(x, y);

        this.context.restore();
    }
}
