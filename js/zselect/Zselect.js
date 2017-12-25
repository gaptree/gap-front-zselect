import {View} from 'zjs/base/View.js';
import {tpl} from 'zjs/tpl';
import {fillObj as fill} from 'zjs/str/fill-obj.js';
import {RequestPlug} from './plug/RequestPlug.js';
import {DropItemPlug} from './plug/DropItemPlug.js';
import {SelectedItemPlug} from './plug/SelectedItemPlug.js';

export class Zselect extends View {
    beforeRender() {
        if (!this.data) {
            this.data = this.buildDataFromAttr();
        }

        this.name = this.data.name;
        this.required = this.data.required;
        this.placeholder = this.data.placeholder;
        this.srcUrl = this.data.srcUrl;
        this.queryName = this.data.queryName;
        this.args = this.data.args;

        this.contentPattern = this.data.pattern.content;
        this.selectedPattern = this.data.pattern.selected || this.contentPattern;
        this.valuePattern = this.data.pattern.value;

        this.isMulti = this.data.isMulti;

        this.ctn.addClass('zselect');
    }

    render() {
        this.ctn.innerHTML = tpl`
            <div class="selected-wrap">
                <input type="text"
                    ${this.required ? 'required="required"' : ''}
                    ${this.placeholder ? ('placeholder=' + this.placeholder) : ''}
                    class="zinput">
            </div>
            <div class="drop-wrap">
                <ul></ul>
            </div>
        `;
    }

    startup() {
        this.selectedWrap = this.ctn.elem('.selected-wrap');
        this.dropWrap = this.ctn.elem('.drop-wrap');
        this.dropUl = this.dropWrap.elem('ul');
        this.input = this.ctn.elem('.selected-wrap input');

        this.requestPlug = this.plug(RequestPlug);
        this.dropItemPlug = this.plug(DropItemPlug);
        this.selectedItemPlug = this.plug(SelectedItemPlug);

        this.input
            .on('focus', () => this.onFocus())
            .on('keyup', () => this.trigger('query'))
            .on('blur', () => this.trigger('blur'))
            .on('keydown', () => {
                if (this.input.value.length > 0) {
                    this.input.style.width = (this.input.value.length + 1) * 10 + 24 + 'px';
                }
            })
            .on('keydown', (e) => {
                if (e.keyCode != 27) {
                    return;
                }

                e.stop();
                e.cancel();
                this.input.blur();
            });

        this
            .on('error', error => this.handleError(error))
            .on('blur', () => this.onBlur())
            .on('select', () => this.onSelect());

        this.ctn.on('mousedown', (e) => {
            e.cancel();
            e.stop();
            this.input.focus();
            return false;
        });

    }

    onFocus() {
        this.showDropWrap();
        this.trigger('query');
    }

    onBlur() {
        this.hideDropWrap();
        this.input.value = '';
    }

    onSelect() {
        this.input.blur();
        //this.input.value = '';
        if (this.dropWrap.style.display == 'block') {
            this.trigger('query');
        }
    }

    showDropWrap() {
        this.dropWrap.style.display = 'block';
    }

    hideDropWrap() {
        this.dropWrap.style.display = 'none';
    }

    handleError(error) {
        this.dropUl.innerHTML = `<li>${error}</li>`;
    }

    getQuery() {
        return this.input.value.trim();
    }

    setArg(key, val) {
        this.args[key] = val;
        this.clear();
        this.requestQueue = null;
    }

    initObj(obj) {
        if (obj.isInited) {
            return;
        }

        if (obj instanceof Object) {
            obj.isInited = true;

            obj.fillContent = fill(this.contentPattern, obj);
            obj.fillValue = fill(this.valuePattern, obj);
            obj.fillSelected = fill(this.selectedPattern, obj);
        }

    }


    setValue(val) {
        this.clear();

        if (!val) {
            return;
        }

        if (!(val instanceof Array)) {
            val = [val];
        }

        val.map(obj => this.create(obj));
    }

    create(obj) {
        this.selectedItemPlug.create(obj);
    }

    clear() {
        this.trigger('clear');
    }

    buildDataFromAttr() {
        let data = {};
        data.name = this.ctn.getAttribute('data-name');
        data.required = this.ctn.getAttribute('data-required');
        data.placeholder = this.ctn.getAttribute('data-placeholder');
        data.srcUrl = this.ctn.getAttribute('data-src-url');
        data.queryName = this.ctn.getAttribute('data-query-name');
        data.args = this.extractArgs();

        data.pattern = {};
        data.pattern.content = this.ctn.getAttribute('data-item-content');
        data.pattern.selected = this.ctn.getAttribute('data-item-selected') || data.pattern.content;
        data.pattern.value = this.ctn.getAttribute('data-item-value');

        data.isMulti = this.ctn.getAttribute('data-multi') === 'multi' ? true : false;
        return data;
    }

    extractArgs() {
        let args = {};
        (this.ctn.getAttribute('data-args') || '').split(';')
            .forEach(item => {
                let arr = item.trim().split(':');
                if (arr[1]) {
                    args[arr[0]] = arr[1];
                }
            });

        return args;
    }
}
