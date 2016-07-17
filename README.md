# eslint-plugin-pabigot

A holder for rules and other `ESLint` extensions.

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-pabigot`:

```
$ npm install eslint-plugin-pabigot --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then
you must also install `eslint-plugin-pabigot` globally.

## Usage

Add `pabigot` to the plugins section of your `.eslintrc` configuration
file. You can omit the `eslint-plugin-` prefix:

```json
{
  "plugins": [
    "pabigot"
  ]
}
```


Then configure the rules you want to use under the rules section.

```json
{
  "rules": {
    "pabigot/affixed-ids": {
      "base": "camelcase",
      "allowedSuffixes": ["_ms"]
    }
  }
}
```

## Supported Rules

* [affixed-ids](docs/rules/affixed-ids.md) - check identifier style conformance
