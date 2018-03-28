import Module from "./Module";
import Menu from "../../elements/Menu";
import MouseEvent from "../../types/MouseEvent";
import MenuItem from "../../elements/MenuItem";
import ModuleProp from "../../types/ModuleProp";
import Divider from "../../elements/Divider";
import Window from "../../elements/Window";
import WindowHeader from "../../elements/WindowHeader";
import Slider from "../../elements/Slider";

export default class Generator extends Module {
    config: ModuleProp;
    contextMenu: Menu = undefined;

    constructor(key: any, config: ModuleProp) {
        super(key);
        this.absolute = true;
        this.config = config;
        this.position = config.position;

        this.handlePropertiesMenu = this.handlePropertiesMenu.bind(this);
        this.handleDelete = this.handleDelete.bind(this);

        this.addEventListener('contextMenu', (event: MouseEvent) => {
            this.contextMenu.position = {x: event.offsetX, y: event.offsetY};
            this.addChild(this.contextMenu);
        });

        const propertiesMenuItem = new MenuItem('properties', 'Properties');
        propertiesMenuItem.addEventListener('mouseUp', this.handlePropertiesMenu);
        const removeMenuItem = new MenuItem('delete', 'Delete');
        removeMenuItem.addEventListener('mouseUp', this.handleDelete);

        this.contextMenu = new Menu('generator-context-menu', {x: 0, y: 0});
        this.contextMenu.addChildren([
            propertiesMenuItem,
            new Divider(''),
            removeMenuItem
        ]);
    }

    handlePropertiesMenu(event: MouseEvent) {
        this.removeChild('generator-context-menu');

        const window = new Window('', {x: event.offsetX, y: event.offsetY});
        const header = new WindowHeader('', 'Bass 3');

        const slider1 = new Slider('', {value: 10, label: '', max: 100, min: 0});
        const slider2 = new Slider('', {value: 10, label: '', max: 100, min: 0});
        const slider3 = new Slider('', {value: 10, label: '', max: 100, min: 0});

        window.addChildren([header, slider1, slider2, slider3]);

        this.addChild(window);
    }

    handleDelete(event: MouseEvent) {
        this.removeChild('generator-context-menu'); //@todo maybe not needed
        this.fire('on-module-remove', this.key);
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();

        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = '#a8adcb';
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
