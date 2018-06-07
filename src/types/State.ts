import {Pattern} from './Pattern';
import ModuleProp from "./ModuleProp";

interface State {
    sequenceNumber: number,
    sequence: any[],
    patterns: Map<number, Pattern>,
    modules: Map<string | number, ModuleProp>,
    begin: number,
    end: number,
}

export default State;
