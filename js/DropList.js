import {View} from 'gap-front-view';

export class DropList extends View {
    static get tag() { return 'ul'; }

    startup() {
        this.ctn.setItems = (items) => this.setItems(items);
    }

    setItems(items) {
        this.ctn.html`
            ${items.map(item => `<li>${item.name}</li>`)}
        `;
    }
}
