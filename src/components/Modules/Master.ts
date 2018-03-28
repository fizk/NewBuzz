import Module from "./Module";
import Menu from "../../elements/Menu";
import MouseEvent from "../../types/MouseEvent";
import MenuItem from "../../elements/MenuItem";
import ModuleProp from "../../types/ModuleProp";

export default class Master extends Module {
    config: ModuleProp;
    contextMenu: Menu = undefined;

    constructor(key: any, config: ModuleProp) {
        super(key);

        this.absolute = true;
        this.config = config;
        this.position = config.position;

        this.contextMenu = new Menu('master-context-menu', {x: 0, y: 0});
        const menuItem1 = new MenuItem('properties', 'Properties');
        menuItem1.addEventListener('mouseUp', (event: MouseEvent) => {
            console.log(event.target);
            this.removeChild('master-context-menu');

        });
        this.contextMenu.addChildren([menuItem1]);


        this.addEventListener('contextMenu', (event: MouseEvent) => {

            this.contextMenu.position = {x: event.offsetX, y: event.offsetY};
            this.addChild(this.contextMenu);
        });
    }

    draw(x: number = 0, y: number = 0): void {

        this.context.save();

        this.context.fillStyle = 'black';
        this.context.fillRect(0, 0, this.width, this.height);

        this.context.fillStyle = '#c6bdab';
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
