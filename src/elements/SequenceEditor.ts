import Node from './Node';
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import CustomEvent from "../types/CustomEvent";
import ModuleProp from "../types/ModuleProp";
import SequenceRow from "./SequenceRow";
import SequenceColumnCount from "./SequenceColumnCount";
import SequenceColumn from "./SequenceColumn";
import SequenceHeadRow from "./SequenceHeadRow";
import SequenceHeaderColumnCount from "./SequenceHeaderColumnCount";
import SequenceHeaderColumn from "./SequenceHeaderColumn";

export default class SequenceEditor extends Node {

    generators: ModuleProp[] = [];

    constructor(key: any) {
        super(key);
        this.type = NOTE_TYPE.IN_LINE;
        this.stretch = true;

        const headerRow = new SequenceHeadRow('');
        headerRow.addChild(new SequenceHeaderColumnCount('', ''));

        this.addChild(headerRow);

        this.addEventListener('on-addModule', (event: CustomEvent<ModuleProp>) => {
            headerRow.addChild(new SequenceHeaderColumn('', event.detail.label));
        });
    }

    get width() {
        return this.parent.width - 150
    }

    get height() {
        return this.parent.height
    }

    draw(x: number = 0, y: number = 0): void {

        this.drawBorder({x:2, y:2, width: this.width - 4, height: this.height - 4}, true);
        this.context.save();
        this.context.translate(4, 4);
        super.draw(x, y);
        this.context.restore();
    }
}
