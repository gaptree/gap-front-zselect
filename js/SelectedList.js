import {View} from 'gap-front-view';
//import {fillObj} from './fillObj.js';

export class SelectedList extends View {
    template() {
        return this.html`
        <div
            class="selected-list"
            ref=${div => this.div = div}
            on-click=${evt => this.click(evt)}
            arr="items"
            item-as="item"
            item-key=${item => item.value}
        >
            ${() => this.html`
                <span
                    class="selected-item"
                    bind-data-val="item.value"
                >
                    <input type="hidden" name="${this.data.name}" bind-value="item.value">
                    $${'item.selected'}
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

    addItem(item) {
        if (!item.value) {
            return;
        }

        if (this.selectedDict.hasOwnProperty(item.value)) {
            return;
        }

        if (!this.data.isMulti) {
            this.clear();
        }

        this.selectedDict[item.value] = item;
        if (!this.data.items) {
            this.data.items = [];
        }

        this.data.items.add(item);
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

    deleteItem(val) {
        this.data.items.removeElem(
            this._selectedDict[val]
        );
        delete(this._selectedDict[val]);
    }

    clear() {
        this._selectedDict = {};
        this.data.items = [];
    }
}
