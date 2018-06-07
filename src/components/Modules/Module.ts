import Node from "../../elements/Node";
import MouseEvent from "../../types/MouseEvent";
import ModuleProp from "../../types/ModuleProp";

export default class Module extends Node {
    config: ModuleProp;

    constructor(key: any, config: ModuleProp) {
        super(key);
        this.absolute = true;
        this.config = config;
        this.position = config.position;

        this.handleSelect = this.handleSelect.bind(this);
        this.handleUnSelect = this.handleUnSelect.bind(this);

        this.addEventListener('mouseDown', this.handleSelect);
        this.addEventListener('mouseUp', this.handleUnSelect);
    }

    handleSelect(event: MouseEvent) {
        if (event.shiftKey === true) {
            this.fire('on-moduleConnectStart', this.config);
        } else {
            this.fire('on-moduleSelect', this.config);
        }

    }

    handleUnSelect(event: MouseEvent) {
        this.fire('on-moduleUnSelect', this.config);
    }

    get height() {
        return 50;
    }

    get width() {
        return 100;
    }
}
