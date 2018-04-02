import {fillObj} from './fillObj.js';

export class ItemRepo {
    constructor(pattern) {
        this.data = {};
        this.pattern = pattern;
        this.idIndex = 0;
    }

    load(items) {
        this.data = {};
        this.idIndex = 0;

        items.forEach(item => {
            this.data[this.idIndex++] = item;
        });
    }

    getSelectedItem(key) {
        let item = this.data[key];
        const selectedPattern = this.pattern.selected || this.pattern.content;
        return {
            value: fillObj(this.pattern.value, item),
            selected: fillObj(selectedPattern, item),
            key: key
        };
    }

    listDropItem() {
        const dropItemArr = [];

        for(let key in this.data) {
            dropItemArr.push({
                key: key,
                content: fillObj(this.pattern.content, this.data[key])
            });
        }

        return dropItemArr;
    }
}
