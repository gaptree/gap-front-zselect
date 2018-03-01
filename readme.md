```
yarn init
yarn global add jest
yarn add babel-core babel-jest babel-preset-env regenerator-runtime --dev
```

```
yarn link jest eslint sass-lint node-sass babel-core babel-jest babel-preset-env regenerator-runtime --dev
```


package.json
```
{

  "scripts": {
    "test": "npm run jest && npm run eslint",
    "jest": "jest",
    "eslint": "eslint ."
  }

}
```

