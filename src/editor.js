'use strict';

import {blockGenerator, Player, Target, FixedBlock, Box} from './block';
import './editor.scss';

class Editor {
    constructor() {
        this.stageElement = document.querySelector('.gameBox');
        this.currentTool = '';
        this.staticInfo = {
            target: 0,
            box: 0
        };
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
            this.downloadLevel();
        });
        document.getElementById('test').addEventListener('click', () => {
            var levelInfo = this.generateLevel();
            if (!levelInfo) {
                return ;
            }
            var testWindow = window.open('./index.html', '_blank');
            window.addEventListener('message', () => {
                testWindow.postMessage(levelInfo, document.origin);
            });
        });
    }

    addBlock(blockType, position) {
        if (this.findBlock(position)) {
            this.removeBlock(position);
        }
        var p = blockGenerator(blockType, position);
        if (blockType == 'player') {
            for (let i = 0; i < this.blockList.length; i++) {
                if (this.blockList[i] instanceof Player) {
                    this.removeBlock({
                        x: this.blockList[i].x,
                        y: this.blockList[i].y
                    });
                }
            }
        }
        this.staticInfo[blockType]++;
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
        ['target', 'box'].forEach((i) => {
            if (theBlock.block.element.classList.contains(i)) {
                this.staticInfo[i]--;
            }
        });
        theBlock.block.element.remove();
        this.blockList.splice(theBlock.index, 1);
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
        var jsonDoc = {
            blockList: [],
            targetList: [],
            prev: null,
            next: null
        };
        if (this.staticInfo['box'] != this.staticInfo['target']) {
            alert('箱子数与目标数不相等!');
            return false;
        }
        for (let i = 0; i < this.blockList.length; i++) {
            if (this.blockList[i] instanceof Player) {
                jsonDoc.playerPosition = {
                    x: this.blockList[i].x,
                    y: this.blockList[i].y
                };
            } else if (this.blockList[i] instanceof Target) {
                jsonDoc.targetList.push({
                    x: this.blockList[i].x,
                    y: this.blockList[i].y
                });
            } else {
                jsonDoc.blockList.push({
                    blockType: this.blockList[i] instanceof FixedBlock ? 'fixed':'box',
                    position: {
                        x: this.blockList[i].x,
                        y: this.blockList[i].y
                    }
                });
            }
        }
        return jsonDoc;
    }

    downloadLevel() {
        var jsonDoc = this.generateLevel();
        if (!jsonDoc) {
            return ;
        }
        var jsonFile = new Blob([JSON.stringify(jsonDoc)], {
            type: 'application/json'
        });
        var a = document.createElement('a');
        a.href = URL.createObjectURL(jsonFile);
        a.download = 'level.json';
        a.click();
    }
}

new Editor();
