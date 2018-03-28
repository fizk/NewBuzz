import Node from "./Node";
import {COLOR} from "../types/COLOR";

class Bar extends Node {
    drawBackground() {
        this.context.save();
        this.context.fillStyle = COLOR.PANEL;
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.restore();
    }

    draw(x: number = 0, y: number = 0): void {
        const padding = 2;
        const leftOffset = 8;
        this.context.save();
        this.drawBackground();
        this.context.translate(padding, padding);
        this.drawBorder({ x: 0, y: 0, width: 3, height: this.height - (padding * 2) });
        this.context.translate(leftOffset, 0);
        super.draw(x + (padding + leftOffset), y);
        this.context.restore();
    }
}

export {Bar};
