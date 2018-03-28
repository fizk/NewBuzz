import Node from "../elements/Node";
import Text from "../elements/Text";
import {Bar} from "../elements/Bar";

export default class InstanceControls extends Node {
    constructor(key: string) {
        super(key);

        const bar = new Bar('bar');

        bar.addChildren([
            new Text('elapsed', 'Elapsed'),
            new Text('loop', 'Loop'),
        ]);

        this.addChild(bar);
    }
}
