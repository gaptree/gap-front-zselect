import {Event} from 'gap-front-event';

export class QueryEvent {
    constructor() {
        this.event = new Event();
    }

    on(handler) {
        this.event.on('query', handler);
    }

    trigger(query) {
        if (this._prevQuery !== query) {
            this.event.trigger('query', query);
            this._prevQuery = query;
        }
    }
}
