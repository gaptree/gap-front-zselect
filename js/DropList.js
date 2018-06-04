import {View} from 'gap-front-view';
//import {transfer} from './lib/transfer';

export class DropList extends View {
    template() {
        return this.html`
        <div
            ref=${div => this.div = div}
            class="drop-wrap"
            style="position: absolute; display: none"
            on-click=${evt => this.click(evt)}
        >
            <ul
                ref=${ul => this.list = ul}
                arr="items"
                item-as="item"
                item-key=${item => item.key}
            >
            ${() => this.html`
                <li>
                    <a
                        href="javascript:;"
                        class="drop-item"
                        bind-key="item.key"
                    >
                        $${'item.content'}
                    </a>
                </li>
            `}
            </ul>
        </div>
        `;
    }

    click(evt) {
        if (evt.target.hasClass('drop-item')) {
            this.triggerSelect(evt.target.getAttribute('key'));
        }
    }

    triggerSelect(key) {
        this.trigger('select', key);
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
        const currentA = this.list.oneElem('.active .drop-item');
        if (currentA) {
            this.triggerSelect(currentA.getAttribute('key'));
        }
    }

    show() {
        this.div.show();
    }

    hide() {
        this.div.hide();
    }

    popActiveLi() {
        const activeLi = this.getActiveLi();
        if (activeLi) {
            activeLi.removeClass('active');
        }
        return activeLi;
    }

    getActiveLi() {
        return this.list.oneElem('li.active');
    }

    getFirstLi() {
        return this.list.firstElementChild;
    }

    getLastLi() {
        return this.list.lastElementChild;
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
