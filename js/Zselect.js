import {View} from 'gap-front-view';
import {SelectedList} from './SelectedList';
import {DropList} from './DropList';
import {ItemRepo} from './ItemRepo';
import {fillObj} from './fillObj';

const KeyCode = {
    esc: 27,
    up: 38,
    down: 40,
    enter: 13,
    delete: 8
};

export class Zselect extends View {
    template() {
        return this.html`
        <div class="zselect"
            on-mousedown=${evt => this.mousedown(evt)}
        >
            <div class="selected-wrap">
                <gap-view
                    view=${new SelectedList(this.data)}
                    ref=${view => this.selectedList = view}
                    bind="selectedList"
                ></gap-view>
                <input
                    type="text"
                    class="zinput"
                    ref=${input => this.input = input}
                    on-focus=${() => this.focus()}
                    on-blur=${() => this.blur()}
                    on-keyup=${evt => this.keyup(evt)}
                    on-keydown=${(evt) => this.keydown(evt)}
                    bind-required="required"
                    bind-placeholder="placeholder"
                >
            </div>
            <gap-view
                view=${new DropList()}
                ref=${view => this.dropList = view}
                bind="dropList"
                on-select=${key => this.select(key)}
            ></gap-view>
        </div>
        `;
    }

    onQuery(handle) {
        this.handleQuery = handle;
    }

    async querying() {
        const query = this.getQuery();
        if (this.currentQuery === query) {
            return;
        }
        
        this.currentQuery = query;
        const response = this.handleQuery(query);

        this.items = (response instanceof Promise) ?
            (await response) : response;

        this.dropList.show();
        this.dropList.update({
            items: this.items.map((item, index) => {
                return {
                    key: 'k' + index,
                    content: fillObj(this.data.pattern.content, item)
                };
            })
        });
    }

    select(key) {
        const index = parseInt(key.substr(1));
        const item = this.items[index];

        const selectedPattern = this.data.pattern.selected || this.data.pattern.content;

        this.selectedList.addItem({
            value: fillObj(this.data.pattern.value, item),
            selected: fillObj(selectedPattern, item),
            key: key
        });

        this.dropList.hide();
        this.input.setVal('');
        this.currentQuery = null;
        this.input.blur();
    }

    mousedown(evt) {
        if (evt.target === this.input) {
            return;
        }

        evt.cancel();
        evt.stop();
        this.input.focus();
        return false;
    }

    focus() {
        this.adjustInputSize();
        this.querying();
        //this.dropList.show();
    }

    keyup() {
        if (!this.blockQuerying) {
            this.querying();
        }
    }

    keydown(evt) {
        this.adjustInputSize();
        this.blockQuerying = false;

        const blockEvt = e => {
            this.blockQuerying = true;
            e.stop();
            e.cancel();
        };

        if (evt.keyCode === KeyCode.esc) {
            this.input.blur();
            blockEvt(evt);
            return false;
        }

        if (evt.keyCode === KeyCode.up) {
            this.dropList.prev();
            blockEvt(evt);
            return false;
        }

        if (evt.keyCode === KeyCode.down) {
            this.dropList.next();
            blockEvt(evt);
            return false;
        }

        if (evt.keyCode === KeyCode.enter) {
            this.dropList.selectCurrent();
            blockEvt(evt);
            return false;
        }

        if (evt.keyCode === KeyCode.delete) {
            if (!this.getQuery()) {
                this.selectedList.deleteLast();
                blockEvt(evt);
                return false;
            }
        }
    }

    blur() {
        this.dropList.hide();
    }

    adjustInputSize() {
        this.input.style.width = (this.input.value.length + 1) * 10 + 24 + 'px';
    }

    getItemRepo() {
        this._itemRepo = this._itemRepo || new ItemRepo(this.data.pattern);
        return this._itemRepo;
    }

    getQuery() {
        return this.input.value.trim();
    }
}
