'use strict';

import './block.css';

export default class Block {
    constructor(position) {
        this.x = position.x;
        this.y = position.y;

        this.element = document.createElement('div');
        document.getElementById('g').appendChild(this.element);
        this.element.classList.add('block');

        this.setElementPosition();
    }

    setElementPosition() {
        this.element.style.left = this.x * 50 + 'px';
        this.element.style.top = this.y * 50 + 'px';
    }
}

export class Target extends Block {
    constructor(position) {
        super(position);
        this.element.classList.add('target');
    }
}

export class FixedBlock extends Block {
    constructor(position) {
        super(position);
        this.element.classList.add('brickBlock');
        this.moveable = false;
    }
}

export class MoveableBlock extends Block {
    constructor(position) {
        super(position);
        this.element.classList.add('moveableBlock');
        this.moveable = true;
    }

    move(direction) {
        switch(direction) {
            case 'up':
                if (this.y > 0) {
                    this.y--;
                }
                break;
            case 'down':
                if (this.y < 9) {
                    this.y++;
                }
                break;
            case 'left':
                if (this.x > 0) {
                    this.x--;
                }
                break;
            case 'right':
                if (this.x < 19) {
                    this.x++;
                }
                break;
        }
        this.setElementPosition();
    }
}

export class Player extends MoveableBlock {
    constructor(position) {
        super(position);
        this.element.classList.add('player');
    }

    resetPosition(position) {
        this.x = position.x;
        this.y = position.y;
        this.setElementPosition();
    }
}

export class Box extends MoveableBlock {
    constructor(position) {
        super(position);
        this.element.classList.add('box');
    }
}

export function blockGenerator(blockType, position) {
    switch (blockType) {
        case 'player':
            return new Player(position);
        case 'box':
            return new Box(position);
        case 'fixed':
            return new FixedBlock(position);
        case 'target':
            return new Target(position);
        default :
            return null;
    }
}
