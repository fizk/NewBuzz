import CustomEvent from "../types/CustomEvent";

export default class EventManager {

    events: {[event: string]: ((detail: any) => void)[]} = {};

    register(event: string, callback: (detail: any) => void) {
        if(!this.events.hasOwnProperty(event)) {
            this.events[event] = [];
        }
        this.events[event].push(callback);
    }

    fire(event: string, detail: any) {
        if(this.events.hasOwnProperty(event)) {
            this.events[event].forEach(callback => {
                callback(new CustomEvent(detail));
            })
        }
    }
}


