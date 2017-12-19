import {Plug} from 'zjs/base/Plug.js';

class SelectedItemPlug extends Plug {
    startup() {
        this.selectedItems = {};
        this.selectedIndex = 0;
        this.selectedStack = [];

        this.view.on('select', obj => this.onSelect(obj));
        this.view.on('unSelect', obj => this.onUnSelect(obj));
        this.view.on('clear', () => this.onClear());

        this.view.selectedWrap.on('click', e => {
            if (e.target.className == 'delete') {
                this.view.trigger('unSelect', e.target.parentElement._obj);
            }
        });

        this.view.input
            .on('keydown', (e) => {
                // is delete key
                if (e.keyCode != 8) {
                    return;
                }

                if (this.view.input.value.trim()) {
                    return;
                }

                if (this.selectedIndex <= 0) {
                    return;
                }

                let obj = this.selectedStack[this.selectedIndex - 1];
                this.view.trigger('unSelect', obj);
            });
    }

    onSelect(obj) {
        if (this.create(obj)) {
            this.view.trigger('selected', obj);
        }
    }

    onUnSelect(obj) {
        if (!obj) {
            throw new Error('obj cannot be emtpy');
        }

        obj.selectedItem.remove();
        delete(this.selectedItems[obj.fillValue]);
        delete(this.selectedStack[obj.selectedIndex]);

        this.selectedIndex--;
        if (this.selectedIndex == 0) {
            this.view.input.placeholder = this.view.placeholder || '';
            this.view.input.required = this.view.required;
            this.view.input.style.width = '100%';
        }

        this.view.trigger('unSelected', obj);
    }

    onClear() {
        this.clear();
    }

    clear() {
        this.selectedItems = {};
        this.selectedStack = [];
        this.selectedIndex = 0;
        this.view.selectedWrap.s('.selected-item').map(elem => elem.remove());
    }

    create(obj) {
        if (!(obj instanceof Object)) {
            throw new Error(obj);
        }

        this.view.initObj(obj);

        if (this.selectedItems[obj.fillValue]) {
            return;
        }

        let selectedItem = document.createElement('span');

        if (!this.view.isMulti) {
            this.clear();
        }


        selectedItem.className  = 'selected-item';
        selectedItem.innerHTML = this.tpl`
            <input type="hidden" name="${this.view.name}" value="${obj.fillValue}">
            ${obj.fillSelected}
            <a class="delete" href="javascript:;">x</a>
        `;
        selectedItem._obj = obj;

        this.view.selectedWrap.insertBefore(selectedItem, this.view.input);

        obj.selectedItem = selectedItem;
        obj.selectedIndex = this.selectedIndex;

        this.selectedItems[obj.fillValue] = 1;
        this.selectedStack[obj.selectedIndex] = obj;
        this.selectedIndex++;

        // view.input
        this.view.input.placeholder = '';
        this.view.input.value = '';
        this.view.input.required = '';
        this.view.input.style.width = '24px';


        return selectedItem;
    }
}

export {SelectedItemPlug};
