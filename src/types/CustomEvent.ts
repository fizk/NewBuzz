import {ModuleType} from "./ModuleType";
import {Point} from "./Point";
import {View} from "./View";

class CustomEvent<T> {
    private _detail: T;

    constructor(detail: T) {
        this._detail = detail;
    }

    get detail(): T {
        return this._detail;
    }
}

export default CustomEvent;

export interface ViewChangeRequest{
    view: View
    pattern?: number
}

export interface ModuleConnectionRequest{
    from: number
    to: number
}

export interface ModuleCreateRequest{
    type: ModuleType,
    label: string,
    position: Point,
}
