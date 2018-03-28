import Node from "../../elements/Node";
import State from "../../types/State";
import ModuleProp from "../../types/ModuleProp";
import {ModuleType} from "../../types/ModuleType";
import SequenceRow from "../../elements/SequenceRow";
import SequenceColumn from "../../elements/SequenceColumn";
import SequenceColumnCount from "../../elements/SequenceColumnCount";
import {Pattern} from "../../types/Pattern";
import {Point} from "../../types/Point";
import {View} from "../../types/View";
import SequenceEditor from "../../elements/SequenceEditor";
import SequenceList from "../../elements/SequenceList";
import KeyEvent from "../../types/KeyEvent";

export default class SequenceView extends Node {
    state: State;
    cursorPosition: Point = {x: 0, y: 0};
    selectedPattern: Pattern;
    generators: ModuleProp[] = [];

    constructor(key: string, state: State) {
        super(key);
        this.state = state;
        this.stretch = true;

        this.addEventListener('arrowDown', this.handleMoveCursorDown.bind(this));
        this.addEventListener('arrowUp', this.handleMoveCursorUp.bind(this));
        this.addEventListener('arrowLeft', this.handleMoveCursorLeft.bind(this));
        this.addEventListener('arrowRight', this.handleMoveCursorRight.bind(this));
        this.addEventListener('number', this.handlePatternAdd.bind(this));
        this.addEventListener('enter', this.handlePatternSelect.bind(this));
        this.addEventListener('delete', this.handlePatternRemove.bind(this));
    }

    handlePatternAdd(event: KeyEvent) {
        this.fire('on-add-pattern', {
            module: this.generators[this.cursorPosition.x].key,
            patternIndex: Number(event.value),
            sequenceIndex: this.cursorPosition.y,
        });
    }

    handlePatternRemove(event: KeyEvent) {
        if(this.selectedPattern) {
            this.fire('on-remove-pattern', {
                module: this.selectedPattern.gen,
                patternIndex: this.selectedPattern.index,
                sequenceIndex: this.cursorPosition.y,
            });
        }
    }

    handlePatternSelect(event: KeyEvent) {
        this.fire('on-view-change', {
            view: View.Pattern,
            pattern: this.selectedPattern,
        });
    }

    handleMoveCursorDown(event: KeyEvent) {
        this.cursorPosition.y = (this.cursorPosition.y+1 > this.state.sequence.length - 1)
            ? this.cursorPosition.y
            : this.cursorPosition.y + 1;
    }

    handleMoveCursorUp(event: KeyEvent) {
        this.cursorPosition.y = (this.cursorPosition.y-1 < 0)
            ? 0
            : this.cursorPosition.y-1;
    }

    handleMoveCursorLeft(event: KeyEvent) {
        this.cursorPosition.x = (this.cursorPosition.x-1 < 0)
            ? 0
            : this.cursorPosition.x-1;
    }

    handleMoveCursorRight(event: KeyEvent) {
        this.cursorPosition.x = (this.cursorPosition.x+1 > this.generators.length - 1)
            ? this.cursorPosition.x
            : this.cursorPosition.x + 1;
    }

    private getGeneratorsFromModules(modules: Map<number|string, ModuleProp>): ModuleProp[] {
        return Array.from(modules.entries())
            .map(([key, module]) => module)
            .filter((module: ModuleProp) => module.type == ModuleType.GEN);
    }

    private mapPatternsToModules(modules: ModuleProp[], sequence: number[], patterns: Map<number, Pattern>): Map<number|string, Pattern> {
        const s = modules.reduce((a: Map<number, any>, b: ModuleProp) => {
            a.set(b.key, undefined);
            return a;
        }, new Map());


        sequence.forEach(seq => {
            const pattern = patterns.get(seq);
            s.set(pattern.gen, pattern);
        });

        return s;
    }

    draw(x: number = 0, y: number = 0): void {

        this.removeChildren();

        this.generators = this.getGeneratorsFromModules(this.state.modules);

        //Sequence Editor
        const sequenceEditor: SequenceEditor = new SequenceEditor('');
        sequenceEditor.width = this.width - 150;
        sequenceEditor.height = this.height;

        //Sequence List
        const sequenceList: SequenceList = new SequenceList('');
        sequenceList.width = 150;
        sequenceList.height = this.height;
        sequenceList.patterns = Array.from(this.state.patterns.values()).filter(value => {
            return value.gen == this.generators[this.cursorPosition.x].key;
        });
        this.addChildren([sequenceEditor, sequenceList]);

        //Sequence Editor Header Row
        const headerRow = new SequenceRow('');
        headerRow.addChild(new SequenceColumnCount('', ''));
        this.generators.forEach((module: ModuleProp) => {
            headerRow.addChild(new SequenceColumn('', module.label));
        });
        sequenceEditor.addChild(headerRow);

        //Sequence Editor Pattern rows
        this.state.sequence.map((sequence, rowIndex) => {
            const patterns = this.mapPatternsToModules(this.generators, sequence, this.state.patterns);

            const sequenceRow: SequenceRow = new SequenceRow('');
            sequenceEditor.addChild(sequenceRow);

            const countColumn = new SequenceColumnCount('',rowIndex*16);
            countColumn.hightlight = !Boolean(rowIndex % 4);
            sequenceRow.addChild(countColumn);

            Array.from(patterns.entries()).forEach(([key, pattern], columnIndex) => {
                const column: SequenceColumn = new SequenceColumn('', pattern ? pattern.label : '....');
                if (rowIndex == this.cursorPosition.y && columnIndex == this.cursorPosition.x) {
                    column.isSelected = true;
                    this.selectedPattern = pattern;
                }
                column.addEventListener('mouseUp', () => {
                    this.cursorPosition = {x: columnIndex, y: rowIndex};
                });
                sequenceRow.addChild(column);
            });
        });

        this.context.save();
        super.draw(x, y);
        this.context.restore();

    }
}
