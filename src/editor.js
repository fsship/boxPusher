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
            this.downloadLevel();
        });
        document.getElementById('test').addEventListener('click', () => {
            var testWindow = window.open('./index.html', '_blank');
            testWindow.addEventListener('DOMContentLoaded', () => {
                testWindow.postMessage(this.generateLevel(), document.origin);
                console.log('posted');
            });
        });
    }

    addBlock(blockType, position) {
        if (this.findBlock(position)) {
            this.removeBlock(position);
        }
        var p = blockGenerator(blockType, position);
        if (!this.staticInfo[p.constructor.name]) {
            this.staticInfo[p.constructor.name] = 1;
        } else {
            this.staticInfo[p.constructor.name]++;
        }
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
        this.blockList = this.blockList.slice(theBlock.index, 1);
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
