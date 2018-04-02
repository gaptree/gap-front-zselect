import {View} from 'gap-front-view';
import {SelectedList} from './SelectedList.js';
import {ItemRepo} from './ItemRepo.js';
import {DropList} from './DropList.js';
import {QueryEvent} from './QueryEvent.js';

const KeyCode = {
    esc: 27,
    up: 38,
    down: 40,
    enter: 13,
    delete: 8
};

export class Zselect extends View {

    static get tag() { return 'div'; }

    render() {
        this.ctn.addClass('zselect');

        this.ctn.html`
        <div class="selected-wrap">

    ${this.view('selectedList', SelectedList, {
        name: this.data.name,
        isMulti: this.data.isMulti
    })}
            <input type="text"
                ${this.data.required ? 'required="required"' : ''}
                ${this.data.placeholder ? ('placeholder=' + this.data.placeholder) : ''}
                class="zinput">
        </div>
        ${this.view('dropList', DropList)}
        `;
    }

    startup() {
        this.input = this.ctn.oneElem('.selected-wrap .zinput');
        this.selectedList = this.get('selectedList');
        this.dropList = this.get('dropList');

        this.itemRepo = new ItemRepo(this.data.pattern);
        this.queryEvent = new QueryEvent();

        this.reg();
        this.api();
    }

    reg() {
        this.input
            .on('focus', () => this.focus())
            .on('blur', () => this.blur())
            .on('keyup', (e) => this.keyup(e))
            .on('keydown', (e) => this.keydown(e));

        this.dropList.onSelect(key => {
            this.selectedList.addItem(this.itemRepo.getSelectedItem(key));
            this.dropList.hide();
            this.input.setVal('');
            this.input.blur();
        });


        this.ctn.on('mousedown', (evt) => {
            if (evt.target !== this.input) {
                evt.cancel();
                evt.stop();
                this.input.focus();
                return false;
            }
        });

    }

    api() {
        this.ctn.showDropList = (items) => this.showDropList(items);
        this.ctn.onQuery = (handler) => this.onQuery(handler);
        this.ctn.setVal = (items) => this.setVal(items);
    }

    setVal(items) {
        if (!Array.isArray(items)) {
            items = [items];
        }
        this.itemRepo.load(items);
        this.itemRepo.listSelectedItem().forEach(selectedItem => {
            this.selectedList.addItem(selectedItem);
        });
    }

    onQuery(handler) {
        this.queryEvent.on(handler);
    }

    showDropList(items) {
        this.itemRepo.load(items);
        this.dropList.show();
        this.dropList.load(this.itemRepo.listDropItem());
    }

    focus() {
        this.adjustInputSize();
        this.queryEvent.trigger(this.getQuery());
        this.dropList.show();
    }

    blur() {
        this.dropList.hide();
    }

    keyup() {
        this.queryEvent.trigger(this.getQuery());
    }

    keydown(evt) {
        this.adjustInputSize();

        const blockEvt = e => {
            e.stop();
            e.cancel();
        };

        if (evt.keyCode === KeyCode.esc) {
            this.input.blur();
            blockEvt(evt);
            return;
        }

        if (evt.keyCode === KeyCode.up) {
            this.dropList.prev();
            blockEvt(evt);
            return;
        }

        if (evt.keyCode === KeyCode.down) {
            this.dropList.next();
            blockEvt(evt);
            return;
        }

        if (evt.keyCode === KeyCode.enter) {
            this.dropList.selectCurrent();
            blockEvt(evt);
            return;
        }

        if (evt.keyCode === KeyCode.delete) {
            if (!this.getQuery()) {
                this.selectedList.deleteLast();
                blockEvt(evt);
                return;
            }
        }
    }

    // protected functions
    getQuery() {
        return this.input.value.trim();
    }

    adjustInputSize() {
        this.input.style.width = (this.input.value.length + 1) * 10 + 24 + 'px';
    }
}
