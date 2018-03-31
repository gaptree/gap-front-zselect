import {Zselect} from '../index.js';

test('Zselect', () => {
    const select = new Zselect();

    select.appendTo(document.body);

    select.onInput(query => {
    });

    select.setItems([
        {name: 'item1'},
        {name: 'item2'}
    ]);

    console.log(document.body.innerHTML);
});
