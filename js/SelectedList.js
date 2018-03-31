import {View} from 'gap-front-view';

export class SelectedList extends View {
    static get tag() { return 'div'; }

    render() {
        this.ctn.html`
            selected list
        `;
    }
}
