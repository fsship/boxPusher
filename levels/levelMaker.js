#!/usr/bin/env node
'use strict';
var fs = require('fs');

var fileName = process.argv[2];
var s = fs.readFileSync(fileName).toString();

var lines = s.split('\n');
var doc = {
    blockList: [],
    playerPosition: {
        x: 0,
        y: 0
    },
    targetList: [],
    prevLevel: null,
    nextLevel: null
};
lines.map((data, i) => {
    var x,y;
    data = data.split(' ');
    for (let i = 1; i < data.length; i++) {
        data[i] = parseInt(data[i]);
    }
    switch (data[0]) {
        case '|':
            x = data[1];
            for (let i = data[2]; i <= data[3]; i++) {
                doc.blockList.push({
                    blockType: 'fixed',
                    position: {
                        x: x,
                        y: i
                    }
                })
            }
            break;
        case '-':
            y = data[1];
            for (let i = data[2]; i <= data[3]; i++) {
                doc.blockList.push({
                    blockType: 'fixed',
                    position: {
                        x: i,
                        y: y
                    }
                })
            }
            break;
        case 'p':
            doc.playerPosition = {
                x: data[1],
                y: data[2]
            };
            break;
        case 'b':
            doc.blockList.push({
                blockType: 'box',
                position: {
                    x: data[1],
                    y: data[2]
                }
            });
            break;
        case 't':
            doc.targetList.push({
                x: data[1],
                y: data[2]
            });
            break;
    }
});

fs.writeFile(fileName + '.json', JSON.stringify(doc));
