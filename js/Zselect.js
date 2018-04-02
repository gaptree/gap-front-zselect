import {View} from 'gap-front-view';
import {Event} from 'gap-front-event';
import {SelectedList} from './SelectedList.js';
import {ItemRepo} from './ItemRepo.js';
import {DropList} from './DropList.js';

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
            ${this.view('selectedList', SelectedList, {name: this.data.name, isMulti: this.data.isMulti})}
            <input type="text"
                ${this.data.required ? 'required="required"' : ''}
                ${this.data.placeholder ? ('placeholder=' + this.data.placeholder) : ''}
                class="zinput">
        </div>
        <div class="drop-wrap">
            ${this.view('dropList', DropList)}
        </div>
        `;
    }

    startup() {
        this.input = this.ctn.oneElem('.selected-wrap .zinput');
        this.selectedWrap = this.ctn.oneElem('.selected-wrap');
        this.dropWrap = this.ctn.oneElem('.drop-wrap');

        this.selectedList = this.get('selectedList');
        this.dropList = this.get('dropList');

        this.itemRepo = new ItemRepo(this.data.pattern);
        this.event = new Event();

        this.dropWrap.style.position = 'relative';

        this.input
            .on('focus', () => this.focus())
            .on('blur', () => this.blur())
            .on('keyup', (e) => this.keyup(e))
            .on('keydown', (e) => this.keydown(e));

        this.dropList.onSelect(key => {
            this.selectedList.addItem(this.itemRepo.getSelectedItem(key));
            this.hideDropList();
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

        this.exportApi();
    }

    exportApi() {
        this.ctn.showDropList = (items) => this.showDropList(items);
        this.ctn.onInput = (handler) => this.onInput(handler);
    }

    onInput(handler) {
        this.event.on('input', handler);
    }

    showDropList(items) {
        this.itemRepo.load(items);
        this.showDropWrap();
        this.dropList.showList(this.itemRepo.listDropItem());
    }

    triggerInput() {
        const currentQuery = this.getQuery();
        if (this._prevQuery !== currentQuery) {
            this.event.trigger('input', currentQuery);
            this._prevQuery = currentQuery;
        }
    }

    focus() {
        this.adjustInputSize();
        this.triggerInput();
        this.showDropWrap();
    }

    blur() {
        this.hideDropList();
    }

    keyup() {
        this.triggerInput();
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

    showDropWrap() {
        this.dropWrap.style.display = 'block';
    }

    hideDropList() {
        this.dropWrap.style.display = 'none';
    }
}
