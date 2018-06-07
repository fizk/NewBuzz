import Module from "./Module";
import Menu from "../../elements/Menu";

export default class Master extends Module {
    contextMenu: Menu = undefined;

    draw(x: number = 0, y: number = 0): void {

        this.context.save();

        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = '#c6bdab';
        this.context.fillRect(1, 1, this.width - 2, this.height - 2);

        this.context.fillStyle = 'black';
        this.context.fillText(
            this.config.label,
            50 - (this.context.measureText(this.config.label).width/2),
            25
        );

        super.draw(x, y);

        this.context.restore();
    }
}
