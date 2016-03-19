/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "builds/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _block = __webpack_require__(1);

	__webpack_require__(10);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Game = function () {
	    function Game() {
	        _classCallCheck(this, Game);

	        this.blockList = [];
	        this.player = (0, _block.blockGenerator)('player', {
	            x: -100,
	            y: -100
	        });
	        this.targetList = [];
	        this.prevLevel = null;
	        this.nextLevel = null;
	        this.notWin = true;
	        this.currentLevel = null;
	        var that = this;
	        document.querySelector('.ctrl').addEventListener('click', function (e) {
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
	        document.body.addEventListener('keydown', function (e) {
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
	                    that.testMove('right');
	                    break;
	            }
	            that.onTargetCount();
	        });
	        this.onTargetCount();
	    }

	    _createClass(Game, [{
	        key: 'loadLevel',
	        value: function loadLevel(levelUrl) {
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
	                    that.player = (0, _block.blockGenerator)('player', levelInfo.playerPosition);
	                    that.targetList = levelInfo.targetList.map(function (element, i) {
	                        return (0, _block.blockGenerator)('target', element);
	                    });
	                    for (var i = 0; i < levelInfo.blockList.length; i++) {
	                        var t = levelInfo.blockList[i];
	                        var s = (0, _block.blockGenerator)(t.blockType, t.position);
	                        that.blockList.push(s);
	                    }
	                    that.onTargetCount();
	                }
	            };
	        }
	    }, {
	        key: 'testMove',
	        value: function testMove(direction) {
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
	                if (nearByBlock instanceof _block.Box && this.getBlockByPosition(testPos2) == null) {
	                    this.player.move(direction);
	                    nearByBlock.move(direction);
	                }
	            }
	        }
	    }, {
	        key: 'getBlockByPosition',
	        value: function getBlockByPosition(position) {
	            var x = position.x;
	            var y = position.y;
	            for (var i = 0; i < this.blockList.length; i++) {
	                if (this.blockList[i].x == x && this.blockList[i].y == y) {
	                    return this.blockList[i];
	                }
	            }
	            return null;
	        }
	    }, {
	        key: 'onTargetCount',
	        value: function onTargetCount() {
	            var boxes = this.blockList.filter(function (t) {
	                return t instanceof _block.Box;
	            });
	            var count = 0;
	            for (var i = 0; i < boxes.length; i++) {
	                for (var j = 0; j < this.targetList.length; j++) {
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
	                window.setTimeout(function () {
	                    document.querySelector('.win').classList.remove('flipped');
	                }, 3000);
	            }
	        }
	    }, {
	        key: 'setControlButton',
	        value: function setControlButton() {
	            document.getElementById('prev').disabled = this.prevLevel ? false : true;
	            document.getElementById('next').disabled = this.nextLevel ? false : true;
	        }
	    }]);

	    return Game;
	}();

	var game = new Game();
	game.loadLevel('./levels/level1.json');

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Box = exports.Player = exports.MoveableBlock = exports.FixedBlock = undefined;

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	exports.blockGenerator = blockGenerator;

	__webpack_require__(2);

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var Block = function () {
	    function Block(position) {
	        _classCallCheck(this, Block);

	        this.x = position.x;
	        this.y = position.y;

	        this.element = document.createElement('div');
	        document.getElementById('g').appendChild(this.element);
	        this.element.classList.add('block');

	        this.setElementPosition();
	    }

	    _createClass(Block, [{
	        key: 'setElementPosition',
	        value: function setElementPosition() {
	            this.element.style.left = this.x * 50 + 'px';
	            this.element.style.top = this.y * 50 + 'px';
	        }
	    }]);

	    return Block;
	}();

	exports.default = Block;

	var Target = function (_Block) {
	    _inherits(Target, _Block);

	    function Target(position) {
	        _classCallCheck(this, Target);

	        var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Target).call(this, position));

	        _this.element.classList.add('target');
	        return _this;
	    }

	    return Target;
	}(Block);

	var FixedBlock = exports.FixedBlock = function (_Block2) {
	    _inherits(FixedBlock, _Block2);

	    function FixedBlock(position) {
	        _classCallCheck(this, FixedBlock);

	        var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(FixedBlock).call(this, position));

	        _this2.element.classList.add('brickBlock');
	        _this2.moveable = false;
	        return _this2;
	    }

	    return FixedBlock;
	}(Block);

	var MoveableBlock = exports.MoveableBlock = function (_Block3) {
	    _inherits(MoveableBlock, _Block3);

	    function MoveableBlock(position) {
	        _classCallCheck(this, MoveableBlock);

	        var _this3 = _possibleConstructorReturn(this, Object.getPrototypeOf(MoveableBlock).call(this, position));

	        _this3.element.classList.add('moveableBlock');
	        _this3.moveable = true;
	        return _this3;
	    }

	    _createClass(MoveableBlock, [{
	        key: 'move',
	        value: function move(direction) {
	            switch (direction) {
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
	    }]);

	    return MoveableBlock;
	}(Block);

	var Player = exports.Player = function (_MoveableBlock) {
	    _inherits(Player, _MoveableBlock);

	    function Player(position) {
	        _classCallCheck(this, Player);

	        var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(Player).call(this, position));

	        _this4.element.classList.add('player');
	        return _this4;
	    }

	    _createClass(Player, [{
	        key: 'resetPosition',
	        value: function resetPosition(position) {
	            this.x = position.x;
	            this.y = position.y;
	            this.setElementPosition();
	        }
	    }]);

	    return Player;
	}(MoveableBlock);

	var Box = exports.Box = function (_MoveableBlock2) {
	    _inherits(Box, _MoveableBlock2);

	    function Box(position) {
	        _classCallCheck(this, Box);

	        var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(Box).call(this, position));

	        _this5.element.classList.add('box');
	        return _this5;
	    }

	    return Box;
	}(MoveableBlock);

	function blockGenerator(blockType, position) {
	    switch (blockType) {
	        case 'player':
	            return new Player(position);
	        case 'box':
	            return new Box(position);
	        case 'fixed':
	            return new FixedBlock(position);
	        case 'target':
	            return new Target(position);
	        default:
	            return null;
	    }
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./Block.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./Block.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".block {\n  position: absolute;\n  width: 50px;\n  height: 50px;\n  margin: 0;\n  -webkit-transition: 0.2s;\n  -moz-transition: 0.2s;\n  -ms-transition: 0.2s;\n  -o-transition: 0.2s;\n  transition: 0.2s;\n  background: lightblue; }\n\n.brickBlock {\n  background: url(" + __webpack_require__(5) + "); }\n\n.player {\n  background: url(" + __webpack_require__(6) + "); }\n\n.moveableBlock {\n  z-index: 99; }\n\n.box {\n  background: url(" + __webpack_require__(7) + "); }\n\n.target {\n  background: url(" + __webpack_require__(8) + "); }\n", ""]);

	// exports


/***/ },
/* 4 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAANaSURBVFhH7ZcxTiQxEEWblZDgBoSbEsER4AZkEEIEITcgQnALCCGCDG7BMSCDDCSC3Vr/Z1Oetj3dMzsgIV4A/r/KPTVlu3u6++E78afJ3d3d1tbWxcUFejFQiodIhbW1NctZWVlBz0ftS6qSDCIVSApp83eu9iX1ERlEKpAU0hqdG1ixLmWgI7geIhVICmmMSlMGrrWmG+gIrodI5Orq6vT0FDG4LAJ5qN9CkmYoy2rypjUgpWlgKOQhkIf6LVSOgY7geohUODs7s5yjoyMbK99QyEMgD2E5Ez22LGv770Bx8zLh88uygmQWN69CBtpBYO6yfvE/5/DwUIO3tzcNvgwKjhwcHJi5vb2NdijfQDsINLv1+PiIrnfrAyKRxh3In8oJ5BvoAFY0j4+PJTc3N+Uk5GcQiTQ+259Kke5MxVlyDEl9YePm5kZOQn4GkUj/sxuk1hZn/bt6oCg9BLpuif8hidF4lpa4TvEiE9HV1VWdpH5yyiyfROP+/n5jY2N9ff3y8hLrP3FycmJ/raOSU7DaPWkHLC8vY9VRpoHOIVaJeshrdOvl5UWD9/d3DT6TallqtTg/P2c0E+l4emyT2E1x+g6hjw4C4bqvr68yiz/0yKssU/F4Fu+L4Ro5RBwEum5/fx9r2uXQA2BCPgXLQyRiXSFQmYkOYI0pK62s9RJrSFnpJBpYAay5y0qPIN94ORlEIrhdZzsJK4DbLKu4/yawzcocdym0h0gkNXnINsKKZnH/9dEUAz2kLB0fo/2AE1jRRPSuOQFJo8qqQfZMZU0sLkmLKyutuKTGhmRiYnGVY0gaaA+RaZCd50/cMJVgSCZwo48YVVbtNJHdy/eQsYiyaqdJyQa6RFpT+9mOFZBpFKWBbjyqn56e7O9sbz7WZg1ub281GEu1rBqpEw12d3c1uL6+1mB26GMEt+cXfw5M8Pz8rLkGVgBrwCJ+QCSC2/M9jYcMk7+krMZDRnMNdABr0WWRUcohkIewopm26cPDgxzJDAUSaQ66hBIMtINAs6y9vT3JnZ0dOZIZCiSGbG1NNNAOAs2yrEno6CA8CoyCmYPL6q+AXmRGdGsIzOy6gc+oqSugKcZcL/vptd3a4H9tGo03+gbTX/aHkN4l+8+ocW/0P3w/uu4vEyT8ZQi5hYIAAAAASUVORK5CYII="

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAIiSURBVFhH7ZgxrsIwDIY7MjIycgSOwREYWZAYuQEjR2DkCIwciSMw8qznn8hySmInrgQS39SkSfrVaeO0w/Mj+Wat2+22XC6HMaj+crmgXRwmrcViAQsznbp1rfP5jEs5mc1m9/sdozipaNH0zedzvsxms0Hti9PpxKfeQWbUBq09VLTk9D0eD9TWOBwO6PPP8XjECTMVLQw8DPv9HlU2rtfrarVCZ7+ZVQtlDxTd9XqN/sPgms0JtQhpRs8Zag1Mq0WQGYbwDGLV6lqEXqBsoNKUIs8juqZAwSMQKBuoNJUrU3PA0D9Qi5ABazPj7gTKBupNZcDIjHIRTphB51gtQiUZ49pIoVX7DpwwYG2qzAobhHe7oDylFnDcgVq1CSmXx0ZCTvaUSji0CBp6u93iUga8NgmfFqMmdBRvale0aDG5XHNsctq1Erwn60kDOQFaHCoC5Qh6x6LlAFIfpSV31aiKoHcsGHW/eoowLZSD+Cqtwtd9CIWUyoxrTerElNe5cS1Leumk/Ip0PRO4wgvURtA+llxIGYoxznXTrpX/XQpMi41aMlS73Q5HfZ+TkkYtlXMoTnxMByFmLVryRxy/UPLNDZlKn5ZaZuVXgzTrD5hVa3TdV3vRwKk0aZFT+lWZyNdDNZUNH7qJitZokAoLtEoP1dz3joqWcrJsqpRZ24RWtOQ1LE6M+pxseDetj3wD6Zbs95OYUKuHn5aHn5ad5/MPvVwR+yJFgSQAAAAASUVORK5CYII="

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAFWSURBVFhH7dPtqoMwDIDhee7/nt0Lkc150jQfjTDY+0eh2DyU+vj1/W3H89S+78fbXW3blaGw6E7ZfxPpLLpHpppoyKJu2chEFov6ZIaJ/o7nQGB/nE7d9gx4s+ge2dREHyzqlnlMdGVRn8xpIoVFHTK/iXQWrZWFTDRk0SpZ1EQWi+qyhIkmLKrIciaasygnS5vIxaKorGIiL4v8sqKJAizyyOomirHIli0x0XuX0MfqeLXctuHTkpzDEuckJVk0HZk2UZ5FxuCKiUqsvkos4+L7/wm1PGs6uCJLspwj07IMSx3GHVeveU4WZo1Ml5dzCVmMZZukJbIAy2OS6jIvy2+SijIXK2qSKrI5K2eS0rIJq2KScjKLVTdJCdmQtcokRWU6a61JCskUVodJ8suurD6T5JR9sLpNkkemOM4tN71Sj+CVtdZnkgzZcKHbJNln9uuLezyeIyDYUE+ZbB8AAAAASUVORK5CYII="

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAIAAACRXR/mAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAABbSURBVFhH7dehDcAwDADBpPvvnEpVaMErJOCO2Mh66rnWGsfmnHv7nN989ryMrEJWIauQVcgqZBWyClmFrEIW8MuzX8gqZBWyClmFrEJWIauQVcgqZBVXZo3xAhGxDFNiOgIzAAAAAElFTkSuQmCC"

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(11);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(9)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./game.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./game.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".gameBox {\n  width: 1000px;\n  height: 500px;\n  margin: auto;\n  position: relative; }\n\n.info {\n  margin: auto; }\n\n.center {\n  margin: auto;\n  width: 80%;\n  text-align: center; }\n\nbutton {\n  border: 2px solid black;\n  border-radius: 5px; }\n\n.win {\n  position: absolute;\n  width: 400px;\n  height: 100px;\n  border-radius: 10px;\n  border: 4px solid black;\n  top: 50%;\n  left: 50%;\n  margin-top: -50px;\n  margin-left: -200px;\n  background: white;\n  display: table;\n  text-align: center;\n  -webkit-transform: rotateY(90deg);\n  -moz-transform: rotateY(90deg);\n  -ms-transform: rotateY(90deg);\n  -o-transform: rotateY(90deg);\n  transform: rotateY(90deg);\n  z-index: 999; }\n\n.win > span {\n  display: table-cell;\n  vertical-align: middle; }\n\n.flipped {\n  -webkit-transform: rotateY(0deg);\n  -moz-transform: rotateY(0deg);\n  -ms-transform: rotateY(0deg);\n  -o-transform: rotateY(0deg);\n  transform: rotateY(0deg);\n  -webkit-transition: all 0.5s;\n  -moz-transition: all 0.5s;\n  -ms-transition: all 0.5s;\n  -o-transition: all 0.5s;\n  transition: all 0.5s; }\n", ""]);

	// exports


/***/ }
/******/ ]);