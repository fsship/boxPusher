'use strict';

import {blockGenerator, Player, Target, FixedBlock} from './block';
import './editor.scss';

class Editor {
    constructor() {
        this.stageElement = document.querySelector('.gameBox');
        this.currentTool = '';
        this.staticInfo = {};
        this.blockList = [];
        this.stageElement.addEventListener('click', (e) => {
            var position = this.positionToGrid(e.clientX - this.stageElement.offsetLeft, e.clientY - this.stageElement.offsetTop);
            if (this.currentTool != 'eraser') {
                this.addBlock(this.currentTool, position);
            } else {
                this.removeBlock(position);
            }
        }, false);
        this.toolBoxElement = document.querySelector('.toolBox');
        this.toolBoxElement.addEventListener('click', (e) => {
            this.setCurrentTool(e.target.dataset.tool);
        });
        this.setCurrentTool('fixed');
        document.getElementById('download').addEventListener('click', () => {
            this.generateLevel();
        });
    }

    addBlock(blockType, position) {
        if (this.findBlock(position)) {
            this.removeBlock(position);
        }
        var p = blockGenerator(blockType, position);
        this.staticInfo[p.constructor.name]++;
        this.blockList.push(p);
    }

    findBlock(position) {
        for (let i = 0; i < this.blockList.length; i++) {
            if (this.blockList[i].x == position.x && this.blockList[i].y == position.y) {
                return {
                    index: i,
                    block: this.blockList[i]
                };
            }
        }
        return null;
    }

    removeBlock(position) {
        var theBlock = this.findBlock(position);
        if (!theBlock) {
            return ;
        }
        theBlock.block.element.remove();
        this.staticInfo[theBlock.block.constructor.name]--;
        this.blockList.slice(theBlock.index);
    }

    setCurrentTool(toolName) {
        var divs = document.querySelectorAll('.toolBox > div');
        (new Array()).forEach.call(divs, (element) => {
            element.classList.remove('active');
        });
        this.currentTool = toolName;
        document.querySelector(`[data-tool='${toolName}']`).classList.add('active');
    }

    positionToGrid(x, y) {
        var position = {
            x: parseInt(x / 50),
            y: parseInt(y / 50)
        };
        return position;
    }

    generateLevel() {
        console.log(this.staticInfo);
        console.log(Player.name);
    }
}

new Editor();
