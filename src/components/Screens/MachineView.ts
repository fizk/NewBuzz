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
import CustomEvent, {ModuleConnectionRequest, ModuleCreateRequest} from "../../types/CustomEvent";

export default class MachineView extends Node {
    selectedModule: Module = undefined;
    connectModule: Module = undefined;
    viewContextMenu: Menu;
    connection: {from: Point, to: Point} = undefined;

    constructor(key: string) {
        super(key);
        this.stretch = true;

        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.handleMoveModule = this.handleMoveModule.bind(this);
        this.handleAddModule = this.handleAddModule.bind(this);
        this.handleSelectModule = this.handleSelectModule.bind(this);
        this.handleUnSelectModule = this.handleUnSelectModule.bind(this);
        this.handleClearContextMenu = this.handleClearContextMenu.bind(this);

        this.handleConnectModuleStart = this.handleConnectModuleStart.bind(this);
        this.handleConnectModule = this.handleConnectModule.bind(this);
        this.handleConnectModuleEnd = this.handleConnectModuleEnd.bind(this);
        this.handleModuleConnect = this.handleModuleConnect.bind(this);

        this.addEventListener('contextMenu', this.handleContextMenu);
        this.addEventListener('mouseDown', this.handleClearContextMenu);
        this.addEventListener('on-addModule', this.handleAddModule);
        this.addEventListener('on-moduleSelect', this.handleSelectModule);
        this.addEventListener('on-moduleUnSelect', this.handleUnSelectModule);
        this.addEventListener('on-moduleConnectStart', this.handleConnectModuleStart);

        this.addEventListener('on-connectModule', this.handleModuleConnect);
    }

    handleClearContextMenu() {
        this.removeChild(this.viewContextMenu);
        this.viewContextMenu = undefined;
    }

    handleMoveModule(event: MouseEvent) {
        this.selectedModule.position.x = event.offsetX - 10; //@todo put the cursor in the right place
        this.selectedModule.position.y = event.offsetY - 10; //@todo put the cursor in the right place
    }

    handleAddModule(event: CustomEvent<ModuleProp>) {
        switch (event.detail.type) {
            case ModuleType.MASTER:
                this.addChild(new Master(event.detail.key, event.detail));
                break;
            case ModuleType.GEN:
                this.addChild(new Generator(event.detail.key, event.detail));
                break;
        }
    }

    handleSelectModule(event: CustomEvent<ModuleProp>) {
        this.selectedModule = <Module>this.children.filter((child: Node) => {
            return child.key === event.detail.key;
        }).reduce((a, b) => b, undefined);

        if (this.selectedModule) {
            this.addEventListener('mouseMove', this.handleMoveModule);
        }
    }

    handleUnSelectModule(event: CustomEvent<ModuleProp>) {
        this.selectedModule = undefined;
        this.removeEventListener('mouseMove', this.handleMoveModule);
    }

    handleModuleConnect(event: CustomEvent<ModuleConnectionRequest>) {
        const toModule = this.getModuleByKey(event.detail.to);
        toModule.config.ref.push(event.detail.from);
    }

    handleContextMenu(event: MouseEvent) {
        const menuItemBass3: MenuItem = new MenuItem('bass3', 'Bass 3');
        menuItemBass3.addEventListener('mouseDown', (event: MouseEvent) => {
            this.fire('on-moduleCreate', <ModuleCreateRequest>{
                type: ModuleType.GEN,
                label: 'Bass 3',
                position: {
                    x: event.offsetX + contextMenu.position.x,
                    y: event.offsetY + contextMenu.position.y
                },
            });
            this.handleClearContextMenu();
        });

        const contextMenu: Menu = new Menu('', {x: event.offsetX, y: event.offsetY});
        this.viewContextMenu = contextMenu;
        contextMenu.addChild(menuItemBass3);
        this.addChild(contextMenu);
    }

    handleConnectModuleEnd(event: MouseEvent) {
        this.children
            .filter((node: Node) => node instanceof Module)
            .forEach((node: Node) => node.removeEventListener('mouseUp', this.handleConnectModuleEnd));

        this.removeEventListener('mouseMove', this.handleConnectModule);
        this.removeEventListener('mouseUp', this.handleConnectModuleEnd);

        if(event.target instanceof Module) {
            this.fire('on-moduleConnect', <ModuleConnectionRequest>{
                from: this.connectModule.config.key,
                to: event.target.config.key,
            });
        }

        this.connectModule = undefined;
        this.connection = undefined;
    }

    handleConnectModuleStart(event: CustomEvent<ModuleProp>) {
        this.connection = {
            from: {x: event.detail.position.x, y: event.detail.position.y},
            to: {x: event.detail.position.x, y: event.detail.position.y},
        };
        this.children
            .filter((node: Node) => node instanceof Module)
            .forEach((node: Node) => node.addEventListener('mouseUp', this.handleConnectModuleEnd));

        this.connectModule = <Module>this.children
            .filter((node: Node) => node.key === event.detail.key)
            .reduce((a, b) => b, undefined);

        this.addEventListener('mouseMove', this.handleConnectModule);
        this.addEventListener('mouseUp', this.handleConnectModuleEnd);
    }

    handleConnectModule(event: MouseEvent) {
        this.connection = {
            from: this.connection.from,
            to: {x: event.offsetX, y: event.offsetY},
        };
    }

    private getModuleByKey(key: any): Module {
        return this.children
            .filter((node: Node) => node.key === key)
            .reduce<Module>((a: Module, b: Module) => b, undefined);
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();
        this.context.lineCap = "square";
        this.context.translate(0.5, 0.5);

        this.context.fillStyle = 'rgb(218, 214, 201)';
        this.context.fillRect(2, 2, this.width - 4, this.height -2 -2);

        this.context.strokeStyle = 'rgb(128, 128, 128)';
        this.context.beginPath();
        this.context.moveTo(2, this.height -2 -2);
        this.context.lineTo(2, 2);
        this.context.lineTo(this.width - 4, 2);
        this.context.stroke();


        this.context.strokeStyle = 'white';
        this.context.beginPath();
        this.context.moveTo(2, this.height -2 -2);
        this.context.lineTo(this.width - 4, this.height -2 -2);
        this.context.lineTo(this.width - 4, 2);
        this.context.stroke();


        this.context.restore();

        //Draw temp connection
        if(this.connection) {
            this.context.save();
            this.context.beginPath();
            this.context.moveTo(this.connection.from.x, this.connection.from.y);
            this.context.lineTo(this.connection.to.x, this.connection.to.y);
            this.context.stroke();
            this.context.restore();
        }

        //Draw permanent connection
        this.children
            .filter((node: Node) => node instanceof Module)
            .forEach((node: Module) => {
                node.config.ref.forEach((ref: number) => {
                    const refModule: Module = this.getModuleByKey(ref);
                    this.context.save();
                    this.context.beginPath();
                    this.context.moveTo(node.position.x + node.dimensions.width / 2, node.position.y + node.dimensions.height / 2);
                    this.context.lineTo(refModule.position.x + node.dimensions.width / 2, refModule.position.y + node.dimensions.height / 2);
                    this.context.stroke();
                    this.context.restore();
                });
            });

        this.context.save();

        super.draw(x, y);

        this.context.restore();
    }
}
