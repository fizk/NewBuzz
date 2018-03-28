import Node from '../elements/Node';

interface MouseEvent {
    offsetY: number;
    offsetX: number;
    type: string;
    target: Node;
    shiftKey: boolean;
    ctrlKey: boolean;
}

export default MouseEvent;
