import Node from '../elements/Node';

export default class WindowHeader extends Node {
    label: string;

    constructor(key: any, label: string) {
        super(key);
        this.label = label;
    }

    get width() {
        return 300;
    }

    get height() {
        return 15;
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();

        const grd = this.context.createLinearGradient(0,0,170,0);
        grd.addColorStop(0,"#135496");
        grd.addColorStop(1,"#5b97d8");

        this.context.fillStyle = grd;
        this.context.fillRect(0, 0, this.width, 15);

        this.context.font = '11px sans-serif';
        this.context.fillStyle = 'white';
        this.context.fillText(this.label, 6, 15);

        this.context.restore();

        super.draw(x, y);
    }
}
