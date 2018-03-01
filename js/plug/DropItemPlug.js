import {Plug} from './Plug.js';

class DropItemPlug extends Plug {
    startup() {
        this.dropUl = this.view.dropUl;

        this.view.on('load', data => this.load(data));
        this.view.on('upDropItem', () => this.upDropItem());
        this.view.on('downDropItem', () => this.downDropItem());

        this.view.input
            .on('keydown', (e) => {
                if (e.keyCode != 40 && e.keyCode != 38) {
                    return;
                }

                e.cancel();
                e.stop();

                if (e.keyCode == 38) {
                    this.view.trigger('upDropItem');
                    return;
                }

                this.view.trigger('downDropItem');
            })
            .on('keydown', (e) => {
                if (e.keyCode != 13) {
                    return;
                }

                e.stop();
                e.cancel();

                let activeDropItem = this.dropUl.elem('.active .drop-item');
                if (!activeDropItem) {
                    return;
                }

                if (activeDropItem._obj) {
                    this.view.trigger('select', activeDropItem._obj);
                }

                let query = activeDropItem.getAttribute('data-query');
                if (query) {
                    this.view.trigger('create', query);
                }
            });
    }

    upDropItem() {
        let currentLi = this.currentLi();
        let upLi = currentLi ? currentLi.previousElementSibling : null;
        if (currentLi) {
            currentLi.removeClass('active');
        }
        if (!upLi) {
            upLi = this.lastLi();
        }
        upLi.addClass('active');
    }

    downDropItem() {
        let currentLi = this.currentLi();
        let downLi = currentLi ? currentLi.nextElementSibling : null;
        if (currentLi) {
            currentLi.removeClass('active');
        }
        if (!downLi) {
            downLi = this.firstLi();
        }
        downLi.addClass('active');
    }

    currentLi() {
        return this.dropUl.elem('li.active');
    }

    firstLi() {
        return this.dropUl.firstElementChild;
    }

    lastLi() {
        return this.dropUl.lastElementChild;
    }

    load(data) {
        this.dropUl.innerHTML = '';

        //if (this.view.onCreate) {
        if (this.view.event.hasEvent('create')) {
            let query = this.view.getQuery();

            if (query) {
                this.dropUl.innerHTML = this.tpl`
                    <li class="active"><a class="drop-item create" data-query="${query}" href="javascript:;">
                        + ${this.trans('create')} <strong>${query}</strong>
                    </a></li>
                `;
            }
        }

        data.map(obj => {
            if (!obj) {
                return;
            }
            this.view.initObj(obj);
            this.insert(obj);
        });
    }

    insert(obj) {
        let dropItem = this.create(obj);
        let li = document.createElement('li');
        this.dropUl.appendChild(li);
        let query = this.view.getQuery();

        li.appendChild(dropItem);

        if (this.view.match && this.view.match(query, obj)) {
            this.removeDropItemOfCreate();
            li.addClass('active');
        }
    }

    create(obj) {
        let a = document.createElement('a');
        let query = this.view.getQuery();

        a.className = 'drop-item';
        a.href = 'javascript:;';
        if (query) {
            a.innerHTML = obj.fillContent.replace(
                new RegExp(query, 'ig'),
                '<strong>$&</strong>'
            );
        } else {
            a.innerHTML = obj.fillContent;
        }
        a.on('click', () => this.view.trigger('select', obj));
        a._obj = obj;

        obj.dropItem = a;

        return a;
    }

    removeDropItemOfCreate() {
        let createDropItem = this.view.dropUl.elem('.drop-item.create');
        if (createDropItem) {
            createDropItem.parentElement.remove();
        }
    }

}

export {DropItemPlug};
