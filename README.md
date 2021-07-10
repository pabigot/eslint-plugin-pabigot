# eslint-plugin-pabigot

[![NPM version](https://img.shields.io/npm/v/eslint-plugin-pabigot.svg)](https://www.npmjs.com/package/eslint-plugin-pabigot "View this project on NPM")
[![Build Status](https://travis-ci.com/pabigot/eslint-plugin-pabigot.svg?branch=master)](https://travis-ci.com/pabigot/eslint-plugin-pabigot "Check build status on TravisCI")
[![Coverage Status](https://coveralls.io/repos/github/pabigot/eslint-plugin-pabigot/badge.svg?branch=master)](https://coveralls.io/github/pabigot/eslint-plugin-pabigot?branch=master "Check coverage status on Coveralls")

A holder for rules and other [ESLint][] extensions that suit my needs.

## Installation

You'll first need to install [ESLint][]:

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
    "pabigot/affixed-ids": ["error", {
      "base": "camelcase",
      "allowedSuffixes": ["_ms"]
    }]
  }
}
```

## Supported Rules

* [affixed-ids](docs/rules/affixed-ids.md) - check identifier style conformance

[ESLint]: http://eslint.org
