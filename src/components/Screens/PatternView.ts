import Node from "../../elements/Node";
import State from "../../types/State";
import {View} from "../../types/View";
import {Point} from "../../types/Point";
import {Pattern} from "../../types/Pattern";
import PatternRow from "../../elements/PatternRow";
import PatternColumnCount from "../../elements/PatternColumnCount";
import PatternColumn from "../../elements/PatternColumn";
import LetterMap from '../../types/LetterMap';
import Menu from "../../elements/Menu";
import MouseEvent from "../../types/MouseEvent";
import MenuItem from "../../elements/MenuItem";
import KeyEvent from "../../types/KeyEvent";

export default class PatternView extends Node {
    selectedPosition: Point = {x: 0, y: 0};
    pattern: Pattern;
    contextMenu: Menu;

    constructor(key: string, state: State) {
        super(key);
        this.pattern = undefined;
        this.stretch = true;

        const contextMenu: Menu = new Menu('', {x: 0, y: 0});
        const newPattern: MenuItem = new MenuItem('', 'New Pattern');
        newPattern.addEventListener('mouseUp', this.handleContentMenuNewPattern.bind(this));
        const duplicatePattern: MenuItem = new MenuItem('', 'Duplicate Pattern');
        duplicatePattern.addEventListener('mouseUp', this.handleContentMenuDuplicatePattern.bind(this));
        contextMenu.addChildren([newPattern, duplicatePattern]);
        this.addEventListener('contextMenu', (event: MouseEvent) => {
            contextMenu.position = {x: event.offsetX, y: event.offsetY};
            this.contextMenu = contextMenu;
        });

        this.addEventListener('enter', this.handleChangeView.bind(this));
        this.addEventListener('arrowUp', this.handleCursorUp.bind(this));
        this.addEventListener('arrowDown', this.handleCursorDown.bind(this));
        this.addEventListener('letter', this.handlePatternUpdate.bind(this));
        this.addEventListener('mouseUp', this.handleCleanUp.bind(this));
    }

    handleChangeView(event: KeyEvent) {
        this.fire('on-view-change', {view: View.Sequence})
    }

    handleCursorUp(event: KeyEvent) {
        this.selectedPosition.y = (this.selectedPosition.y-1 < 0)
            ? this.selectedPosition.y
            : this.selectedPosition.y-1 ;
    }

    handleCursorDown(event: KeyEvent) {
        this.selectedPosition.y = (this.selectedPosition.y+1 > this.pattern.pattern.length-1)
            ? this.selectedPosition.y
            : this.selectedPosition.y+1
    }

    handlePatternUpdate(event: KeyEvent) {
        const newPattern = Object.assign({}, this.pattern);
        newPattern.pattern[this.selectedPosition.y] = LetterMap[event.value];
        this.fire('on-update-pattern', {pattern: newPattern});
    }

    handleContentMenuNewPattern(event: MouseEvent) {
        this.fire('on-new-pattern', {
            module: this.pattern.gen
        });
        this.contextMenu = undefined;
    }

    handleContentMenuDuplicatePattern(event: MouseEvent) {
        this.fire('on-duplicate-pattern', {
            module: this.pattern.gen,
            pattern: [...this.pattern.pattern],
        });
        this.contextMenu = undefined;
    }

    handleCleanUp(event: MouseEvent) {
        this.contextMenu = undefined;
    }

    draw(x: number = 0, y: number = 0): void {

        this.removeChildren();

        this.drawBorder({x:2, y:2, width: this.width-4, height: this.height-4}, true);

        this.context.save();
        this.context.translate(4, 4);

        const patternHeader: PatternRow = new PatternRow('');
        this.addChild(patternHeader);

        patternHeader.addChild(new PatternColumnCount('', ''));

        (this.pattern ? this.pattern.pattern : []).forEach((pattern: string, index: number) => {
            const row: PatternRow = new PatternRow('');
            const counter: PatternColumnCount = new PatternColumnCount('', index);
            const column: PatternColumn = new PatternColumn('', pattern ? pattern : '....');
            column.isSelected = index == this.selectedPosition.y;
            column.hightlight = !Boolean(index % 4);
            column.addEventListener('mouseUp', () => {
                this.selectedPosition = {x: 0, y: index};
            });
            row.addChildren([counter, column]);
            this.addChild(row);
        });

        if(this.contextMenu) {
            this.addChild(this.contextMenu);
        }

        super.draw(x, y);
        this.context.restore();
    }
}
