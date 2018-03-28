import Node from "../elements/Node";
import SystemControls from "./SystemControls";
import ApplicationControls from "./ApplicationControls";
import InstanceControls from "./InstanceControls";
import Divider from "../elements/Divider";

export default class Header extends Node {

    constructor(key: string) {
        super(key);

        this.addChildren([
            new SystemControls('system-controls'),
            new Divider('d1'),
            new ApplicationControls('application-controls'),
            new Divider('d2'),
            new InstanceControls('instance-controls'),
        ]);
    }
}
