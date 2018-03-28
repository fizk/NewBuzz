import Node from "../../elements/Node";
import MouseEvent from "../../types/MouseEvent";
import {Point} from "../../types/Point";
import {ModuleType} from "../../types/ModuleType";
import Master from "../Modules/Master";
import Module from "../Modules/Module";
import Menu from "../../elements/Menu";
import MenuItem from "../../elements/MenuItem";
import Generator from "../Modules/Generator";
import State from "../../types/State";
import ModuleProp from "../../types/ModuleProp";

export default class MachineView extends Node {
    state: State;
    selectedModule: Module = undefined;
    viewContextMenu: Menu;
    connection: {from: Point, to: Point} = undefined;

    constructor(key: string, state: State) {
        super(key);
        this.state = state;
        this.stretch = true;

        this.handleModuleSelect = this.handleModuleSelect.bind(this);
        this.handleModuleDeselect = this.handleModuleDeselect.bind(this);
        this.handleMouseMove = this.handleMouseMove.bind(this);
        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.handleMouseUp = this.handleMouseUp.bind(this);

        this.addEventListener('contextMenu', this.handleContextMenu);
        this.addEventListener('mouseUp', this.handleMouseUp);
        this.addEventListener('mouseMove', this.handleMouseMove);
    }

    private createModule(key: any, value: ModuleProp): Module {
        switch (value.type) {
            case ModuleType.MASTER:
                return new Master(key, value);
            case ModuleType.GEN:
                return new Generator(key, value);
            default:
                return undefined;
        }
    }

    private moduleList(): Module[] {
        return Array.from(this.state.modules.entries()).map(([key, value]) => {
            const currentNode: Module = <Module>this.getChildByKey(key);
            if(currentNode) {
                currentNode.position = value.position;
                return currentNode
            } else {
                const newNode = this.createModule(key, value);
                if (!newNode) {
                    return undefined;
                }
                newNode.addEventListener('mouseDown', this.handleModuleSelect);
                newNode.addEventListener('mouseUp', this.handleModuleDeselect);
                return newNode;
            }
        }).filter(module => module !== undefined);
    }

    handleContextMenu(event: MouseEvent) {
        const menuItemBass3: MenuItem = new MenuItem('bass3', 'Bass 3');
        menuItemBass3.addEventListener('mouseUp', (event: MouseEvent) => {
            this.fire('on-module-create', {
                type: ModuleType.GEN,
                label: 'Bass 3',
                position: {
                    x: event.offsetX + contextMenu.position.x,
                    y: event.offsetY + contextMenu.position.y
                },
            });
            this.viewContextMenu = undefined;
        });

        const contextMenu: Menu = new Menu('', {x: event.offsetX, y: event.offsetY});
        contextMenu.addChild(menuItemBass3);

        this.viewContextMenu = contextMenu;
    }

    handleModuleSelect(event: MouseEvent) {
        this.selectedModule = event.target;
        if(event.shiftKey) {
            this.connection = {
                from: {
                    x: event.target.position.x + event.offsetX,
                    y: event.target.position.y + event.offsetY,
                },
                to: {
                    x: event.target.position.x + event.offsetX,
                    y: event.target.position.y + event.offsetY,
                },
            }
        }
    }

    handleModuleDeselect(event: MouseEvent) {
        if(this.connection && event.target !== this && event.target !== this.selectedModule) {
            this.fire('on-module-connect', {
                src: this.selectedModule.key,
                dest: event.target.key,
            })
        }
        this.connection = undefined;
        this.selectedModule = undefined;
    }

    handleMouseUp(event: MouseEvent) {
        this.viewContextMenu = undefined;
        this.connection = undefined;
        this.selectedModule = undefined;
    }

    handleMouseMove(event: MouseEvent) {
        if(this.selectedModule) {
            if(this.connection) {
                this.connection.to = {
                    x: event.offsetX,
                    y: event.offsetY,
                }
            } else {
                this.state.modules.set(this.selectedModule.key, {
                    ...this.state.modules.get(this.selectedModule.key),
                    position: {
                        x: (event.offsetX) - 10, //@todo
                        y: (event.offsetY) - 10, //@todo
                    }
                });
            }
        }
    }

    draw(x: number = 0, y: number = 0): void {

        this.drawBorder({x:2, y:2, width: this.width-4, height: this.height-4}, true);

        //Draw temp connection
        if(this.connection) {
            this.context.save();
            this.context.beginPath();
            this.context.moveTo(this.connection.from.x, this.connection.from.y);
            this.context.lineTo(this.connection.to.x, this.connection.to.y);
            this.context.stroke();
            this.context.restore();
        }

        //Draw connections
        Array.from(this.state.modules.entries()).forEach(([key, module]) => {
            module.ref.forEach(ref => {
                const refModule = this.state.modules.get(ref);
                this.context.save();
                this.context.beginPath();
                this.context.moveTo(module.position.x + 50, module.position.y + 25);
                this.context.lineTo(refModule.position.x + 50, refModule.position.y + 25);
                this.context.stroke();
                this.context.restore();
            })
        });

        this.context.save();

        //Reason about the modules
        const modules = this.moduleList();

        //Set modules
        this.setChildren(modules);

        //Set menus
        if(this.viewContextMenu) {
            this.addChild(this.viewContextMenu);
        }

        super.draw(x, y);

        this.context.restore();

    }
}
