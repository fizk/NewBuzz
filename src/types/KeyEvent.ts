import Node from '../elements/Node';

interface KeyEvent {
    type: string;
    value: string,
    target: Node;
    shiftKey: boolean;
    ctrlKey: boolean;
}

export default KeyEvent;
