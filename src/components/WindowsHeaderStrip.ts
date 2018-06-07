import Node from "../elements/Node";
import {COLOR} from "../types/COLOR";
import Header from './Header';
import Stage from './Stage';
import Footer from './Footer';
import {View} from "../types/View";
import CustomEvent from "../types/CustomEvent";
import State from "../types/State";
import ModuleProp from "../types/ModuleProp";
import {Pattern} from "../types/Pattern";
import {colorShade} from "../util/color";


export default class WindowsHeaderStrip extends Node {

    get height() {
        return 18 + 2 + 2;
    }

    draw(x: number = 0, y: number = 0): void {

        const gradient = this.context.createLinearGradient(0, 0, this.width-2-2, 18);
        gradient.addColorStop(0, '#0a246a');
        gradient.addColorStop(1, '#a6caf0');

        this.context.save();
        this.context.fillStyle = gradient;
        this.context.fillRect(2, 2, this.width-2-2, 18);
        super.draw(x, y);
        this.context.restore();
    }
}

