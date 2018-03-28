import {Point} from './Point';

interface ModuleProp {
    key: number,
    position: Point;
    type: any;
    label: string;
    patternIndex: number;
    ref: number[];
    mute: boolean;
    properties: any;
}

export default ModuleProp;
