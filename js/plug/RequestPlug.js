import {Plug} from './Plug.js';
import {RequestQueue} from 'gap-front-request';

class RequestPlug extends Plug {
    startup() {
        this.requestQueue = null;

        this.view.on('query', () => this.query());
        this.view.on('blur', () => this.clearRequestQueue());
        this.view.on('select', () => this.clearRequestQueue());
        this.view.on('unSelect', () => this.clearRequestQueue());
    }

    query() {
        this.getRequestQueue().queryPostJson(this.view.input.value.trim());
    }

    getRequestQueue() {
        if (this.requestQueue) {
            return this.requestQueue;
        }

        this.requestQueue = new RequestQueue({
            srcUrl: this.view.data.srcUrl,
            queryName: this.view.data.queryName,
            send: this.view.data.args,
        });

        this.requestQueue
            .onLoad(data => this.view.trigger('load', data))
            .onErr(err => this.view.trigger('error', err));

        return this.requestQueue;
    }

    clearRequestQueue() {
        this.getRequestQueue().clear();
    }
}

export {RequestPlug};
