import {View} from 'gap-front-view';
import {fillObj} from './fillObj.js';

export class SelectedList extends View {
    template() {
        return this.html`
        <div
            class="selected-list"
            ref=${div => this.div = div}
            on-click=${evt => this.click(evt)}
            arr="items"
            item-as="item"
            item-key=${item => this.getItemValue(item)}
        >
            ${() => this.html`
                <span
                    class="selected-item"
                    bind-data-val=${this.filter({item: item => this.getItemValue(item)})}
                >
                    <input
                        type="hidden"
                        name="${this.props.name}"
                        bind-value=${this.filter({item: item => this.getItemValue(item)})}>
                    $${this.filter({item: item => this.getItemSelected(item)})}
                    <a class="delete" href="javascript:;">x</a>
                </span>
            `}
        </div>
        `;
    }

    get selectedDict() {
        this._selectedDict = this._selectedDict || {};
        return this._selectedDict;
    }

    getItems() {
        if (!this.data.items) {
            return [];
        }
        return this.data.items.filter(item => {
            if (item) {
                return item;
            }
        });
        //return Object.values(this.selectedDict);
    }


    click(evt) {
        if (evt.target.className === 'delete') {
            this.deleteItem(
                evt.target.parentNode.getAttribute('data-val')
            );
        }
    }

    deleteLast() {
        const lastElem = this.div.lastElementChild;
        if (lastElem) {
            const val = lastElem.getAttribute('data-val');
            this.deleteItem(val);
        }
    }

    triggerChange() {
        this.trigger(
            'change', 
            this.getItems()
        );
    }

    getItemValue(item) {
        return fillObj(this.props.pattern.value, item);
    }

    getItemSelected(item) {
        const selectedPattern = this.props.pattern.selected || this.props.pattern.content;
        return fillObj(selectedPattern, item);
    }

    addItem(item) {
        const value = this.getItemValue(item);
        if (this.selectedDict.hasOwnProperty(value)) {
            return;
        }
        if (!this.props.isMulti) {
            this.clear();
        }
        if (!this.data.items) {
            this.data.items = [];
        }
        this.selectedDict[value] = item;
        this.data.items.push(item);
        this.triggerChange();
        /*
        const value = this.getItemValue(item);
        item.value = value;
        if (!value) {
            return;
        }

        if (this.selectedDict.hasOwnProperty(value)) {
            return;
        }

        if (!this.props.isMulti) {
            this.clear();
        }

        this.selectedDict[value] = item;
        if (!this.data.items) {
            this.data.items = [];
        }

        this.data.items.push(item);
        this.triggerChange();
        */
    }

    deleteItem(val) {
        const selectedItem = this.selectedDict[val] || null;
        if (selectedItem) {
            delete(this.selectedDict[val]);
            this.data.items.delete(selectedItem);
        }
        this.triggerChange();
    }

    clear() {
        this._selectedDict = {};
        this.data.items = [];
    }
}
