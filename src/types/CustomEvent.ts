
class CustomEvent {
    private _detail: any;

    constructor(detail) {
        this._detail = detail;
    }

    get detail() {
        return this._detail;
    }
}

export default CustomEvent;
