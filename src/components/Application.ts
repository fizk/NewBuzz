import Node from "../elements/Node";
import {COLOR} from "../types/COLOR";
import Header from './Header';
import Stage from './Stage';
import Footer from './Footer';
import State from "../types/State";
import {colorShade} from "../util/color";

export default class Application extends Node {
    constructor(key: string, state: State) {
        super(key);

        this.addChildren([
            new Header(),
            new Stage('main', state),
            new Footer(),
        ]);
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = colorShade(COLOR.WINDOWS, 0.78);
        this.context.fillRect(0, 0, this.width, this.height);
        this.context.lineCap = "square";
        this.context.restore();

        this.context.save();
        super.draw(x, y);
        this.context.restore();
    }
}

