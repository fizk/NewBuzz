import Node from './Node';

export default class SequenceHeadRow extends Node {
    get height() {
        return 20;
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();
        this.context.lineWidth = 1;
        this.context.beginPath();
        this.context.moveTo(0, this.height);
        this.context.lineTo(this.width-8, this.height);
        this.context.stroke();
        this.context.restore();
        super.draw(x, y);
    }
}
