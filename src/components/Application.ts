import Node from "../elements/Node";
import {COLOR} from "../types/COLOR";
import Header from './Header';
import Stage from './Stage';
import Footer from './Footer';
import {View} from "../types/View";
import CustomEvent from "../types/CustomEvent";
import State from "../types/State";
import ModuleProp from "../types/ModuleProp";
import {Pattern} from "../types/Pattern";

export default class Application extends Node {
    state: State;

    constructor(key: string, state: State) {
        super(key);
        this.state = state;

        this.addChildren([
            new Header('header'),
            new Stage('main', state),
            new Footer('footer'),
        ]);

        this.handleModuleCreate = this.handleModuleCreate.bind(this);
        this.handleModuleConnect = this.handleModuleConnect.bind(this);
        this.handleModuleRemove = this.handleModuleRemove.bind(this);
        this.handleUpdatePattern = this.handleUpdatePattern.bind(this);
        this.handleNewPattern = this.handleNewPattern.bind(this);
        this.handleDuplicatePattern = this.handleDuplicatePattern.bind(this);
        this.handleAddPattern = this.handleAddPattern.bind(this);
        this.handleRemovePattern = this.handleRemovePattern.bind(this);

        this.addEventListener('on-module-create', this.handleModuleCreate);
        this.addEventListener('on-module-connect', this.handleModuleConnect);
        this.addEventListener('on-module-remove', this.handleModuleRemove);
        this.addEventListener('on-update-pattern', this.handleUpdatePattern);
        this.addEventListener('on-new-pattern', this.handleNewPattern);
        this.addEventListener('on-duplicate-pattern', this.handleDuplicatePattern);
        this.addEventListener('on-add-pattern', this.handleAddPattern);
        this.addEventListener('on-remove-pattern', this.handleRemovePattern);

        this.fire('on-view-change', {view: View.Machine});
    }

    handleModuleRemove(event: CustomEvent) {
        console.log(`Remove module: ${event.detail}`)
    }

    handleModuleCreate(event: CustomEvent) {
        const moduleKey = new Date().getTime();
        const config: ModuleProp = {
            key: moduleKey,
            position: event.detail.position,
            type: event.detail.type,
            label: event.detail.label,
            patternIndex: 0,
            mute: false,
            ref: [],
            properties: {
                asdr: {
                    a: 0,
                    s: 0,
                    d: 0,
                    r: 0,
                }
            },
        };

        this.state.modules.set(config.key, config);

        const patternKey = (new Date().getTime() * 2);
        this.state.patterns.set(patternKey, {
            key: patternKey,
            gen: moduleKey,
            index: 0,
            label: '00',
            pattern: [
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            ]
        });

        if(this.state.sequence[this.state.sequenceNumber] === undefined) {
            this.state.sequence.push([patternKey]);
        } else {
            this.state.sequence[this.state.sequenceNumber].push(patternKey);
            // this.state.sequence[Math.floor(Math.random() * this.state.sequence.length-1) + 1 ].push(patternKey)
        }


    }

    handleModuleConnect(event: CustomEvent) {
        this.state.modules.get(event.detail.src).ref.push(event.detail.dest);
    }

    handleUpdatePattern(event: CustomEvent) {
        this.state.patterns.set(event.detail.pattern.key, event.detail.pattern);
    }

    handleNewPattern(event: CustomEvent) {
        const patternKey = (new Date().getTime() * 2);
        const moduleProp: ModuleProp = this.state.modules.get(event.detail.module);
        moduleProp.patternIndex = moduleProp.patternIndex + 1;
        const moduleCurrentIndex = moduleProp.patternIndex;
        this.state.patterns.set(patternKey, {
            key: patternKey,
            gen: event.detail.module,
            label: `0${moduleCurrentIndex}`,
            index: moduleCurrentIndex,
            pattern: [
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
                undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined,
            ]
        });

        this.fire('on-view-change', {
            view: View.Pattern,
            pattern: this.state.patterns.get(patternKey),
        });
    }

    handleDuplicatePattern(event: CustomEvent) {
        const patternKey = (new Date().getTime() * 2);
        const moduleProp: ModuleProp = this.state.modules.get(event.detail.module);
        moduleProp.patternIndex = moduleProp.patternIndex + 1;
        const moduleCurrentIndex = moduleProp.patternIndex;
        this.state.patterns.set(patternKey, {
            key: patternKey,
            gen: event.detail.module,
            index: moduleCurrentIndex,
            label: `0${moduleCurrentIndex}`,
            pattern: event.detail.pattern,
        });

        this.fire('on-view-change', {
            view: View.Pattern,
            pattern: this.state.patterns.get(patternKey),
        });
    }

    handleAddPattern(event: CustomEvent) {
        const p = Array.from(this.state.patterns.entries()).map(([key, value]) => value).filter((value: Pattern) => {
            return (value.gen === event.detail.module && value.index === event.detail.patternIndex);
        }).reduce((a, b) => b, undefined);

        if(p) {
            this.state.sequence[event.detail.sequenceIndex].push(p.key);
        }
    }

    handleRemovePattern(event: CustomEvent) {
        console.log(event);
    }

    draw(x: number = 0, y: number = 0): void {
        this.context.save();
        this.context.fillStyle = COLOR.STAGE;
        this.context.fillRect(0, 0, this.width, this.height);

        super.draw(x, y);

        this.context.restore();
    }
}

