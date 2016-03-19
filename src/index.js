"use strict";

import { Box, blockGenerator } from './block';
import './game.css';

class Game {
    constructor() {
        this.blockList = [];
        this.player = blockGenerator('player', {
            x: -100,
            y: -100
        });
        this.targetList = [];
        this.prevLevel = null;
        this.nextLevel = null;
        this.notWin = true;
        this.currentLevel = null;
        var that = this;
        document.querySelector('.ctrl').addEventListener('click', (e) => {
            console.log(e);
            switch (e.target.id) {
                case 'prev':
                    that.loadLevel(that.prevLevel);
                    break;
                case 'next':
                    that.loadLevel(that.nextLevel);
                    break;
                case 'restart':
                    that.loadLevel(that.currentLevel);
                    break;
            }
        });
        document.body.addEventListener('keydown', (e) => {
            switch (e.keyCode) {
                case 38:
                    that.testMove('up');
                    break;
                case 40:
                    that.testMove('down');
                    break;
                case 37:
                    that.testMove('left');
                    break;
                case 39:
                    that.testMove('right')
                    break;
            }
            that.onTargetCount();
        });
        this.onTargetCount();
    }

    loadLevel(levelUrl) {
        var xhr = new XMLHttpRequest();
        xhr.open('get', levelUrl, true);
        xhr.send();
        var that = this;
        xhr.onreadystatechange = function () {
            if (xhr.readyState == 4 && xhr.status == 200) {
                console.log(xhr.responseText);
                that.blockList = [];
                var levelInfo = JSON.parse(xhr.responseText);
                that.currentLevel = levelUrl;
                that.prevLevel = levelInfo.prev;
                that.nextLevel = levelInfo.next;
                that.notWin = true;
                console.log(that);
                that.setControlButton();
                document.getElementById('g').innerHTML = '';
                that.player = blockGenerator('player', levelInfo.playerPosition);
                that.targetList = levelInfo.targetList.map((element, i) => {
                    return blockGenerator('target', element);
                });
                for (let i = 0; i < levelInfo.blockList.length; i++) {
                    let t = levelInfo.blockList[i];
                    let s = blockGenerator(t.blockType, t.position);
                    that.blockList.push(s);
                }
                that.onTargetCount();
            }
        };
    }

    testMove(direction) {
        var p = this.player;
        var directionList = {
            up: {
                x: 0,
                y: -1
            },
            down: {
                x: 0,
                y: 1
            },
            left: {
                x: -1,
                y: 0
            },
            right: {
                x: 1,
                y: 0
            }
        };
        var testPos1 = {
            x: p.x + directionList[direction].x,
            y: p.y + directionList[direction].y
        };
        var testPos2 = {
            x: testPos1.x + directionList[direction].x,
            y: testPos1.y + directionList[direction].y
        };
        var nearByBlock = this.getBlockByPosition(testPos1);
        console.log(nearByBlock);
        if (nearByBlock === null) {
            this.player.move(direction);
        } else {
            if (nearByBlock instanceof Box && this.getBlockByPosition(testPos2) == null) {
                this.player.move(direction);
                nearByBlock.move(direction);
            }
        }
    }

    getBlockByPosition(position) {
        var x = position.x;
        var y = position.y;
        for (let i = 0; i < this.blockList.length; i++) {
            if (this.blockList[i].x == x && this.blockList[i].y == y) {
                return this.blockList[i];
            }
        }
        return null;
    }

    onTargetCount() {
        var boxes = this.blockList.filter((t) => t instanceof Box);
        var count = 0;
        for (let i = 0; i < boxes.length; i++) {
            for (let j = 0; j < this.targetList.length; j++) {
                if (boxes[i].x == this.targetList[j].x && boxes[i].y == this.targetList[j].y) {
                    count++;
                    break;
                }
            }
        }
        document.getElementById('targetInfo').innerText = 'GOAL: ' + count + '/' + this.targetList.length;
        if (this.notWin && count && count == this.targetList.length) {
            this.notWin = false;
            document.querySelector('.win').classList.add('flipped');
            window.setTimeout(() => {
                document.querySelector('.win').classList.remove('flipped');
            }, 3000)
        }
    }

    setControlButton() {
        document.getElementById('prev').disabled = this.prevLevel ? false : true;
        document.getElementById('next').disabled = this.nextLevel ? false : true;
    }
}

var game = new Game();
game.loadLevel('./levels/level1.json');