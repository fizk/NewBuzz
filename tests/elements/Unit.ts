import {expect, assert} from 'chai';
import Node from '../../src/elements/Node';
import {NOTE_TYPE} from "../../src/types/NOTE_TYPE";

describe('Node', () => {

    describe('add | remove children', () => {
        it('setChildren', () => {
            class TestClass extends Node {
                constructor(key: string) {
                    super(key);
                    this.children = [
                        new Node('1'),
                        new Node('2')
                    ]
                }
            }

            const unit = new TestClass('1');
            unit.setChildren([new Node('1')]);

            assert.equal(1, unit.getChildren().length);
        });

        it('removeChildren', () => {
            class TestClass extends Node {
                constructor(key: string) {
                    super(key);
                    this.children = [
                        new Node('1'),
                        new Node('2')
                    ]
                }
            }

            const unit = new TestClass('1');
            unit.removeChildren();

            assert.equal(0, unit.getChildren().length);
        });

        it('addChildren', () => {
            class TestClass extends Node {
                constructor(key: string) {
                    super(key);
                    this.children = [
                        new Node('1'),
                        new Node('2')
                    ]
                }
            }

            const unit = new TestClass('1');
            unit.addChildren([new Node('1'), new Node('2')]);

            assert.equal(4, unit.getChildren().length);
        });

        it('addChild', () => {
            class TestClass extends Node {
                constructor(key: string) {
                    super(key);
                    this.children = [
                        new Node('1'),
                        new Node('2')
                    ]
                }
            }

            const unit = new TestClass('1');
            unit.addChild(new Node('1'));

            assert.equal(3, unit.getChildren().length);
        });

        it('getChildByKey', () => {
            class TestClass extends Node {}

            const child1 = new Node('1');
            const child2 = new Node('2');
            const child3 = new Node('3');
            const unit = new TestClass('0');
            unit.addChildren([child1, child2, child3]);

            assert.isTrue(child2 === unit.getChildByKey('2'));
        });

        it('getChildByKey | undefined', () => {
            class TestClass extends Node {}

            const child1 = new Node('1');
            const child2 = new Node('2');
            const child3 = new Node('3');
            const unit = new TestClass('0');
            unit.addChildren([child1, child2, child3]);

            assert.isTrue(undefined === unit.getChildByKey('100'));
        });
    });

    describe('height', () => {
        it('should have no height or width (\'cause it has no children)', () => {
            const unit = new Node('');
            assert.equal(0, unit.height);
            assert.equal(0, unit.width);
        });

        it('should get height of child if not set on the parent', () => {
            const unit = new Node('');
            const child = new Node('');
            child.height = 20;

            unit.addChild(child);

            assert.equal(unit.height, 20, 'height');
        });

        it('should get height of stack (BLOCK) of children if not set on the parent', () => {
            const unit = new Node('');

            const child1 = new Node('');
            child1.height = 20;
            const child2 = new Node('');
            child2.height = 20;
            const child3 = new Node('');
            child3.height = 20;

            unit.addChildren([child1, child2, child3]);

            assert.equal(unit.height, 60, 'height');
        });

        it('should get height of tallest (INLINE) of children if not set on the parent', () => {
            const unit = new Node('');

            const child1 = new Node('');
            child1.height = 10;
            child1.type = NOTE_TYPE.IN_LINE;

            const child2 = new Node('');
            child2.height = 20;
            child2.type = NOTE_TYPE.IN_LINE;

            const child3 = new Node('');
            child3.height = 30;
            child3.type = NOTE_TYPE.IN_LINE;

            unit.addChildren([child1, child2, child3]);

            assert.equal(unit.height, 30, 'height');
        });

        it('should get height of itself it set, regardless of child', () => {
            const unit = new Node('');
            unit.height = 30;
            const child = new Node('');
            child.height = 20;

            unit.addChild(child);

            assert.equal(unit.height, 30, 'height');
        });

        it('should stretch to maximize height', () => {
            const parent = new Node('1');
            parent.height = 100;

            const childTop = new Node('');
            childTop.height = 10;

            const childMiddle = new Node('');
            childMiddle.stretch = true;

            const childBottom = new Node('');
            childBottom.height = 10;

            parent.addChildren([childTop, childMiddle, childBottom]);

            assert.equal(80, childMiddle.height);
        })
    });

    describe('width', () => {
        it('should not have width if not set and has no parent', () => {
            const unit = new Node('');

            assert.equal(unit.width, 0);
        });

        it('should honor its own width', () => {
            const unit = new Node('');
            unit.width = 20;

            assert.equal(unit.width, 20);
        });

        it('should get width from parent if BLOCK', () => {
            const parent = new Node('');
            parent.width = 100;
            const child = new Node('');

            parent.addChild(child);

            assert.equal(child.width, 100);
        });

        it('should not get width from parent if INLINE', () => {
            const parent = new Node('');
            parent.width = 100;
            const child = new Node('');
            child.type = NOTE_TYPE.IN_LINE;

            parent.addChild(child);

            assert.equal(child.width, 0);
        });

        it('should get with from children if INLINE', () => {
            const parent = new Node('');
            parent.type = NOTE_TYPE.IN_LINE;

            const child1 = new Node('');
            child1.type = NOTE_TYPE.IN_LINE;
            child1.width = 10;
            const child2 = new Node('');
            child2.type = NOTE_TYPE.IN_LINE;
            child2.width = 10;

            parent.addChildren([child1, child2]);

            assert.equal(20, parent.width);
        })
    });

    describe('draw', () => {
        const application = new Node('');

    });
});
