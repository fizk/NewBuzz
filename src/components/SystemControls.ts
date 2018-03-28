import Node from "../elements/Node";
import Text from "../elements/Text";
import {Bar} from "../elements/Bar";

export default class SystemControls extends Node {
    constructor(key: string) {
        super(key);

        const bar = new Bar('bar');

        bar.addChildren([
            new Text('file', 'File'),
            new Text('edit', 'Edit'),
            new Text('help', 'Help'),
        ]);

        this.addChild(bar);
    }
}
