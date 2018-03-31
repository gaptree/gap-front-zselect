import {View} from 'gap-front-view';
import {SelectedList} from './SelectedList.js';
import {DropList} from './DropList.js';

const EscKeyCode = 27;

export class Zselect extends View {

    static get tag() { return 'div'; }

    render() {
        this.ctn.addClass('zselect');

        this.ctn.html`
        <div class="selected-wrap">
            ${this.view('selectedList', SelectedList)}
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

        this.input
            .on('focus', () => this.focus())
            .on('keyup', () => this.query())
            .on('blur', () => this.blur())
            .on('keydown', (e) => this.keydown(e));


        this.ctn.on('mousedown', (e) => {
            e.cancel();
            e.stop();
            this.input.focus();
            return false;
        });

        this.ctn.setItems = (items) => this.setItems(items);
    }

    setItems(items) {
        this.dropList.setItems(items);
    }

    focus() {
    }

    query() {
    }

    blur() {
    }

    keydown(evt) {
        this.adjustInputSize();
        if (evt.keyCode != EscKeyCode) {
            return;
        }

        evt.stop();
        evt.cancel();
        this.input.blur();
    }
}
