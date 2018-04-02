import {View} from 'gap-front-view';
//import {fillObj} from './fillObj.js';

export class SelectedList extends View {
    static get tag() { return 'div'; }

    render() {
        this.ctn.addClass('selected-list');
    }

    startup() {
        this.selectedDict = {};

        this.ctn.on('click', (evt) => {
            if (evt.target.className === 'delete') {
                this.deleteItem(
                    evt.target.parentNode.getAttribute('val')
                );
            }
        });

        this.exportApi();
    }

    exportApi() {
        this.ctn.addItem = (item) => this.addItem(item);
        this.ctn.deleteLast = () => this.deleteLast();
    }

    deleteLast() {
        const lastElem = this.ctn.lastElementChild;
        if (lastElem) {
            const val = lastElem.getAttribute('val');
            lastElem.remove();
            delete(this.selectedDict[val]);
        }
    }

    deleteItem(val) {
        this.ctn.allElem(`[val="${val}"]`)
            .forEach(elem => elem.remove());
        delete(this.selectedDict[val]);
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
        const selectedSpan = document.createElement('span');
        selectedSpan.setAttribute('val', item.value);

        selectedSpan.className = 'selected-item';
        selectedSpan.html`
            <input type="hidden" name="${this.data.name}" value="${item.value}">
            ${item.selected}
            <a class="delete" href="javascript:;">x</a>
        `;
        this.ctn.appendChild(selectedSpan);
    }

    clear() {
        this.selectedDict = {};
        this.ctn.innerHTML = '';
    }
}
