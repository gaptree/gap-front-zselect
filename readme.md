# Gap Front Zselect

## Install

```
$ yarn add gap-front-zselect
```

## Usage

```javascript
import {Zselect} from 'gap-front-zselect';
import {oneElem} from 'gap-front-web';
import {userRepo} from '../../mock/userRepo.js';

const select = new Zselect({
    required: 'required',
    name: 'userId',
    isMulti: true,
    pattern: {
        content: '#{nick} (#{email})',
        selected: '',
        value: '#{userId}'
    }
});

select.onInput(input => userRepo.query(input));
userRepo.onLoad(users => select.showDropList(users));

select.appendTo(oneElem('.zselect-container'));
```
