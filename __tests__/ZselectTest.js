import {tpl, scriptJson} from 'gap-front-fun';
import {Zselect} from '../index.js';

test('Zselect', () => {
    const selectScriptJson = scriptJson({
        name: 'channels',
        srcUrl: '//www.gaptree.com',
        queryName: 'q',
        isMulti: true,
        pattern: {
            content: '#{title}',
            selected: '#{title}',
            value: '#{channelId};#{zcode};#{title}'
        }
    });

    document.body.innerHTML = tpl`
        <div id="zselect">${selectScriptJson}</div>
    `;

    new Zselect('#zselect');

    expect(document.body.innerHTML).toBe(tpl`
        <div id="zselect" class="zselect">
            <div class="selected-wrap">
                <input type="text" class="zinput">
            </div>
            <div class="drop-wrap">
                <ul></ul>
            </div>
        </div>
    `);
});
