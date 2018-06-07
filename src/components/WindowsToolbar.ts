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
import {NOTE_TYPE} from "../types/NOTE_TYPE";

export default class WindowsToolbar extends Node {
    type: NOTE_TYPE = NOTE_TYPE.IN_LINE;

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.lineCap = "square";
        this.context.translate(0.5, 0.5);

        this.context.strokeStyle = colorShade(COLOR.WINDOWS, 1.1);
        this.context.beginPath();
        this.context.moveTo(6, 2);
        this.context.lineTo(4, 2);
        this.context.lineTo(4, this.height - 5);
        this.context.stroke();

        this.context.strokeStyle = colorShade(COLOR.WINDOWS, 0.1);
        this.context.beginPath();
        this.context.moveTo(6, 2);
        this.context.lineTo(6, this.height - 4);
        this.context.lineTo(4, this.height - 4);
        this.context.stroke();
        this.context.restore();

        this.context.save();
        // this.context.translate(8, 0);
        super.draw(x, y);
        this.context.restore();
    }
}

