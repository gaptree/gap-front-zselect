import {Zselect} from '../index.js';

test('Zselect', () => {
    const select = new Zselect({
        name: 'user',
        pattern: {
            content: '#{name}'
        }
    });

    select.appendTo(document.body);

    select.showDropList([
        {name: 'item1'},
        {name: 'item2'}
    ]);

    expect(document.body.innerHTML).toBe(
        '<div class="zselect">'
         + '<div class="selected-wrap"> '
         + '<div class="selected-list"></div> '
         + '<input type="text" class="zinput"> '
         + '</div> '
         + '<div class="drop-wrap" style="position: absolute;">'
         + '<ul>'
         + '<li> '
         + '<a href="javascript:;" class="drop-item" key="0"> item1 </a> '
         + '</li> '
         + '<li> '
         + '<a href="javascript:;" class="drop-item" key="1"> item2 </a> '
         + '</li></ul></div></div>'
    );
});
