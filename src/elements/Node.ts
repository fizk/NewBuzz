
import {NOTE_TYPE} from "../types/NOTE_TYPE";
import {Dimension} from "../types/Dimension";
import KeyEvent from "../types/KeyEvent";
import {Point} from "../types/Point";
import {COLOR} from "../types/COLOR";
import EventManager from "../util/EventManager";


export default class Node{
    children: Node[] = [];
    key: any = undefined;
    parent: Node = undefined;
    context: CanvasRenderingContext2D = undefined;
    type: NOTE_TYPE = NOTE_TYPE.BLOCK;
    stretch: boolean = false;
    nodeWidth: number = 0;
    nodeHeight: number = 0;
    dimensions: Dimension;
    static eventManager: EventManager = new EventManager();
    events: {
        mouseDown: ((event: Event) => void)[],
        mouseMove: ((event: Event) => void)[],
        mouseUp: ((event: Event) => void)[],
        arrowDown: ((event: KeyEvent) => void)[],
        arrowUp: ((event: KeyEvent) => void)[],
        arrowLeft: ((event: KeyEvent) => void)[],
        arrowRight: ((event: KeyEvent) => void)[],
        contextMenu: ((event: KeyEvent) => void)[],
        enter: ((event: KeyEvent) => void)[],
        letter: ((event: KeyEvent) => void)[],
        number: ((event: KeyEvent) => void)[],
        'delete': ((event: KeyEvent) => void)[],
    } = {
        mouseDown: [],
        mouseMove: [],
        mouseUp: [],
        arrowDown: [],
        arrowUp: [],
        arrowLeft: [],
        arrowRight: [],
        contextMenu: [],
        enter: [],
        letter: [],
        number: [],
        'delete': [],
    };
    honorWidth: boolean = false;
    honorHeight: boolean = false;

    absolute: boolean = false;
    position: Point = {x: 0, y: 0};

    constructor(key: number | string) {
        this.key = key;
    }

    set height(height: number) {
        this.honorHeight = true;
        this.nodeHeight = height;
    }

    get height(): number {
        if(this.honorHeight) {
            return this.nodeHeight;
        }

        if (this.stretch) {
            return this.parent.height - this.parent.children.filter((node: Node) => {
                return node !== this;
            }).reduce((a, b) => {
                return a + b.height;
            }, 0);
        }

        if (this.children.length === 0) {
            return this.nodeHeight;
        }

        let currentHeight = 0;
        let inlineHeightArray = [0];

        this.children.forEach((child: Node, index: number, collection: Node[]) => {
            if(child.type === NOTE_TYPE.BLOCK) {
                currentHeight += child.height;
            } else if(child.type === NOTE_TYPE.IN_LINE) {
                inlineHeightArray.push(child.height);
            }

            if (child.type === NOTE_TYPE.BLOCK || (collection.length === index + 1)) {
                currentHeight += Math.max(...inlineHeightArray);
                inlineHeightArray = [0];
            }
        });

        return currentHeight;
    }

    set width(width: number) {
        this.honorWidth = true;
        this.nodeWidth = width;
    }

    get width(): number {
        if(this.honorWidth) {
            return this.nodeWidth;
        }

        if (this.type === NOTE_TYPE.BLOCK) {
            if (this.parent) {
                return this.parent.width;
            } else {
                return 0;
            }
        } else if (this.type === NOTE_TYPE.IN_LINE) {
            return this.children.reduce((a, b) => {
                return a + b.width;
            }, 0);
        }

    }

    addEventListener(type: string, callback: (event: any) => void) {
        if(type.match(/-/)) {
            Node.eventManager.register(type, callback);
        } else {
            this.events[type].push(callback);
        }

    }

    removeEventListener(type: string, callback: (event: any) => void) {
        this.events[type] = this.events[type].filter(cb => {
            return cb !== callback;
        })
    }

    fire(event: string, detail: any) {
        Node.eventManager.fire(event, detail);
    }

    getChildren(): Node[] {
        return this.children
    }

    setChildren(children: Node[]): void {
        this.removeChildren();
        this.addChildren(children);
    }

    removeChildren(): void {
        this.children = [];
    }

    removeChild(key: number | string): void {
        this.children = this.children.filter((child: Node) => child.key !== key);
    }

    setChild(child: Node) {
        this.removeChildren();
        this.addChild(child);
    }

    addChild(child: Node): void {
        child.parent = this;
        child.context = this.context;
        this.children.push(child)
    }

    addChildren(children: Node[]): void {
        children.forEach(this.addChild.bind(this));
    }

    getChildByKey(key: number | string): Node | undefined {
        return this.children
            .filter((child: Node) => child.key == key)
            .reduce((a: Node, b: Node) => b, undefined);
    }

    drawBorder(dimensions: Dimension, active: boolean = false) {
        this.context.save();

        this.context.strokeStyle = active ? COLOR.BORDER_DARK: COLOR.BORDER_LIGHT;

        this.context.beginPath();
        this.context.moveTo(dimensions.x, dimensions.y);
        this.context.lineTo(dimensions.width, dimensions.y);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(dimensions.x, dimensions.y);
        this.context.lineTo(dimensions.x, dimensions.height);
        this.context.stroke();

        this.context.strokeStyle = active ? COLOR.BORDER_LIGHT : COLOR.BORDER_DARK;

        this.context.beginPath();
        this.context.moveTo(dimensions.width, dimensions.height);
        this.context.lineTo(dimensions.width, dimensions.y);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(dimensions.width, dimensions.height);
        this.context.lineTo(dimensions.x, dimensions.height);
        this.context.stroke();

        this.context.restore();
    }

    draw(x: number = 0, y: number = 0): void {
        let offsetY = 0;
        let offsetX = 0;
        let lastChild: Node = undefined;
        this.children.filter((child: Node) => child !== undefined).forEach((child: Node) => {
            this.context.save();
            if (child.absolute) {
                this.context.translate(child.position.x, child.position.y);
                child.context = this.context;
                child.draw(x + child.position.x, y + child.position.y);
            } else {
                if(lastChild && lastChild.type === NOTE_TYPE.BLOCK) {
                    offsetY += lastChild.height;
                    offsetX = 0;
                } else if (lastChild && lastChild.type === NOTE_TYPE.IN_LINE && child.type == NOTE_TYPE.IN_LINE) {
                    offsetX += lastChild.width;
                } else if (lastChild && lastChild.type === NOTE_TYPE.IN_LINE && child.type == NOTE_TYPE.BLOCK) {
                    offsetX = 0;
                    offsetY += lastChild.height;
                }

                this.context.translate(offsetX, offsetY);
                child.context = this.context;
                child.draw(x + offsetX, y + offsetY);
            }

            lastChild = child;

            this.context.restore();
        });

        this.dimensions = {x: x, y: y, height: this.height, width: this.width};
    }
}
