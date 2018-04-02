import {View} from 'gap-front-view';
import {Event} from 'gap-front-event';

export class DropList extends View {
    static get tag() { return 'ul'; }

    startup() {
        this.event = new Event();

        this.ctn.on('click', (evt) => {
            if (evt.target.hasClass('drop-item')) {
                this.triggerSelect(evt.target.getAttribute('key'));
            }
        });

        this.exportApi();
    }

    exportApi() {
        this.ctn.showList = (itemArr) => this.showList(itemArr);
        this.ctn.onSelect = (handler) => this.onSelect(handler);
        this.ctn.next = () => this.next();
        this.ctn.prev = () => this.prev();
        this.ctn.selectCurrent = () => this.selectCurrent();
    }

    onSelect(handler) {
        this.event.on('select', handler);
    }

    showList(itemArr) {
        this.ctn.html`
            ${itemArr.map(item => `
                <li>
                    <a href="javascript:;" class="drop-item"
                        key="${item.key}">
                        ${item.content}
                    </a>
                </li>
            `)}
        `;
    }

    next() {
        const activeLi = this.popActiveLi();
        let nextLi = activeLi ? activeLi.nextElementSibling : null;
        if (!nextLi) {
            nextLi = this.getFirstLi();
        }
        nextLi.addClass('active');
        this.autoScroll(nextLi);
    }

    prev() {
        const activeLi = this.popActiveLi();
        let prevLi = activeLi ? activeLi.previousElementSibling : null;
        if (!prevLi) {
            prevLi = this.getLastLi();
        }
        prevLi.addClass('active');
        this.autoScroll(prevLi);
    }

    selectCurrent() {
        const currentA = this.ctn.oneElem('.active .drop-item');
        if (currentA) {
            this.triggerSelect(currentA.getAttribute('key'));
        }
    }

    // protected function
    popActiveLi() {
        const activeLi = this.getActiveLi();
        if (activeLi) {
            activeLi.removeClass('active');
        }
        return activeLi;
    }

    getActiveLi() {
        return this.ctn.oneElem('li.active');
    }

    getFirstLi() {
        return this.ctn.firstElementChild;
    }

    getLastLi() {
        return this.ctn.lastElementChild;
    }

    triggerSelect(key) {
        this.event.trigger('select', key);
    }

    autoScroll(li) {
        const wrap = li.parentElement.parentElement;
        const min = wrap.scrollTop + li.offsetHeight;
        const max = wrap.scrollTop + wrap.offsetHeight - li.offsetHeight;
        if (li.offsetTop < min) {
            wrap.scrollTop = li.offsetTop; 
        }

        if (li.offsetTop > max) {
            wrap.scrollTop = li.offsetTop - wrap.offsetHeight + li.offsetHeight; 
        }
    }
}
