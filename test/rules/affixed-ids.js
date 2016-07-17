/**
 * @file Tests for affixed-ids
 */

'use strict';

var rule = require('../../rules/affixed-ids');
var RuleTester = require('eslint').RuleTester;

var ruleTester = new RuleTester();

ruleTester.run('affixed-ids', rule, {
  valid: [
    /* Base style */
    {code: 'camelCase = 3;'},
    {code: 'camelCase = 3;',
     options: [{baseStyle: 'camelcase'}]},
    {code: 'CONSTANTS_ARE_FINE = 3;'},
    {code: 'init_lower = 3;',
     options: [{baseStyle: {regex: {pattern: '^[a-z]'}}}]},

    /* Exceptions */
    {code: 'snake_id = 3',
     options: [{ignoredIdentifiers: ['snake_id']}]},
    {code: 'id = snake_id',
     options: [{ignoredIdentifiers: ['snake_id']}]},
    {code: 'any_iGnOrEd_id = 3',
     options: [{ignoredIdentifiers: [{regex: {pattern: '_ignored_', flags: 'i'}}]}]},

    /* Prefixes */
    {code: 'opt_id = id',
     options: [{allowedPrefixes: ['opt_']}]},
    {code: 'anyPrefix_id = id',
     options: [{allowedPrefixes: [{regex: {pattern: 'any[a-zA-Z]*_'}}]}]},
    {code: 'anyPrefix_id = opt_id',
     options: [{allowedPrefixes: ['opt_', {regex: {pattern: 'any[a-zA-Z]*_'}}]}]},

    /* Suffixes */
    {code: 'id_opt = id',
     options: [{allowedSuffixes: ['_opt']}]},
    {code: 'id_anySuffix = id',
     options: [{allowedSuffixes: [{regex: {pattern: '_any[a-zA-Z]*'}}]}]},
    {code: 'id_anySuffix = id_opt',
     options: [{allowedSuffixes: [{regex: {pattern: '_any[a-zA-Z]*'}}, '_opt']}]},

    /* Call expressions */
    {code: 'snake_id(3);'},
    {code: 'snake_id(3);',
     options: [{ignoreCalls: true}]},

    /* Member Properties */
    {code: 'id = obj.snake_id;'},
    {code: 'id = obj.snake_id;',
     options: [{ignoreReadProperties: true}]},
    {code: 'id = obj.snake_id;',
     options: [{ignoreProperties: true}]},
    {code: 'id = 0 + obj.snake_id;'},
    {code: 'obj.snake_id = 3;',
     options: [{ignoreProperties: true}]},
    {code: 'obj.snake_id.subobj = 3;',
     options: [{ignoreProperties: true}]},

    /* Object Properties */
    {code: 'obj = {snake_id: 3};',
     options: [{ignoreProperties: true}]},

    /* Leading and trailing underscores */
    {code: '_ = 3;'},
    {code: '_id_ = 3;'},
    {code: '___id__ = 3;'},
    {code: '_id_ = 3;',
     options: [{stripPrefixUnderscores: true, stripSuffixUnderscores: true}]},
    {code: '_id = 3;',
     options: [{stripPrefixUnderscores: true, stripSuffixUnderscores: false}]},
    {code: '_ = 3;',
     options: [{stripPrefixUnderscores: true, stripSuffixUnderscores: false}]},
    {code: 'id_ = 3;',
     options: [{stripPrefixUnderscores: false, stripSuffixUnderscores: true}]},
    {code: '_ = 3;',
     options: [{stripPrefixUnderscores: false, stripSuffixUnderscores: true}]},
    {code: 'id = 3;',
     options: [{stripPrefixUnderscores: false, stripSuffixUnderscores: false}]},
    {code: '_ = 3;',
     options: [{stripPrefixUnderscores: false, stripSuffixUnderscores: false}]}
  ],
  invalid: [
    /* Base style */
    {code: 'snake_id = id',
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'id = snake_id',
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'Upper = 3;',
     options: [{baseStyle: {regex: {pattern: '^[a-z]'}}}],
     errors: [{message: "Identifier 'Upper' does not conform.",
               type: 'Identifier'}]},

    /* Exceptions */
    {code: 'snake_id_ = id',
     options: [{ignoredIdentifiers: ['snake_id'], stripSuffixUnderscores: true}],
     errors: [{message: "Identifier 'snake_id_' does not conform.",
               type: 'Identifier'}]},

    /* Prefixes */
    {code: 'xopt_id = id',
     options: [{allowedPrefixes: ['opt_']}],
     errors: [{message: "Identifier 'xopt_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'nanyPrefix_id = id',
     options: [{allowedPrefixes: [{regex: {pattern: 'any[a-zA-Z]*_'}}]}],
     errors: [{message: "Identifier 'nanyPrefix_id' does not conform.",
               type: 'Identifier'}]},

    /* Suffixes */
    {code: 'id_optx = id',
     options: [{allowedSuffixes: ['_opt']}],
     errors: [{message: "Identifier 'id_optx' does not conform.",
               type: 'Identifier'}]},
    {code: 'id_anySuffix2 = id',
     options: [{allowedSuffixes: [{regex: {pattern: '_any[a-zA-Z]*'}}]}],
     errors: [{message: "Identifier 'id_anySuffix2' does not conform.",
               type: 'Identifier'}]},
    {code: 'op_t = id',
     options: [{allowedSuffixes: ['op_t', {regex: {pattern: 'a_[0-9]+'}}]}],
     errors: [{message: "Identifier 'op_t' does not conform.",
               type: 'Identifier'}]},
    {code: 'a_3 = id',
     options: [{allowedSuffixes: ['op_t', {regex: {pattern: 'a_[0-9]'}}]}],
     errors: [{message: "Identifier 'a_3' does not conform.",
               type: 'Identifier'}]},

    /* Object references */
    {code: 'snake_id.prop = 3;',
     options: [{ignoreProperties: true}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},

    /* Exceptions */
    {code: 'any_iGnOrEd_id = 3',
     options: [{ignoredIdentifiers: [{regex: {pattern: '_ignored_'}}]}],
     errors: [{message: "Identifier 'any_iGnOrEd_id' does not conform.",
               type: 'Identifier'}]},

    /* Call expressions */
    {code: 'snake_id(3);',
     options: [{ignoreCalls: false}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},

    /* Member Properties */
    {code: 'id = obj.snake_id;',
     options: [{ignoreReadProperties: false}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'id = 0 + obj.snake_id;',
     options: [{ignoreReadProperties: false}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'id = obj.subobj.snake_id;',
     options: [{ignoreReadProperties: false}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'id = obj.subobj.snake_id;',
     options: [{ignoreReadProperties: false}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'id = obj.snake_id.id;',
     options: [{ignoreReadProperties: false}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'obj.snake_id = 3;',
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'obj.snake_id.subobj = 3;',
     options: [{ignoreReadProperties: false}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'snake_id.prop = 3;',
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},

    /* Object Properties */
    {code: 'obj = {snake_id: 3};',
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'obj = {prop: snake_id};',
     options: [{ignoreProperties: true}],
     errors: [{message: "Identifier 'snake_id' does not conform.",
               type: 'Identifier'}]},

    /* Leading and trailing underscores */
    {code: '_id = 3;',
     options: [{stripPrefixUnderscores: false}],
     errors: [{message: "Identifier '_id' does not conform.",
               type: 'Identifier'}]},
    {code: 'id_ = 3;',
     options: [{stripSuffixUnderscores: false}],
     errors: [{message: "Identifier 'id_' does not conform.",
               type: 'Identifier'}]}
  ]
});
