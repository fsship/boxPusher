'use strict';

export default class DropArea {
    constructor() {
        this.element = document.createElement('div');
        this.element.innerHTML = '拖放关卡文件到这里';
        this.element.classList.add('dropArea');
        this.element.dr;
        this.element.style.display = 'none';
        document.body.appendChild(this.element);
    }

    show() {
        this.element.style.display = 'block';
    }

    hide() {
        this.element.style.display = 'none';
    }

    addDropHandler(callback) {
        this.element.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        this.element.addEventListener('drop', callback);
    }
}