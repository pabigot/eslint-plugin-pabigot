/**
 * @file ESLint rule to match base identifier style with affix exclusions.
 * @license MIT
 */

'use strict';

module.exports = {
  meta: {
    docs: {
      description: 'Enforce ID style excluding affixes',
      category: 'Stylistic Issues',
      recommended: false,
    },
    schema: {
      type: 'array',
      definitions: {
        BaseStyle: {
          enum: ['camelcase'],
        },
        RegExp: {
          type: 'object',
          required: ['regex'],
          additionalProperties: false,
          properties: {
            regex: {
              type: 'object',
              required: ['pattern'],
              additionalProperties: false,
              properties: {
                pattern: {
                  type: 'string',
                },
                flags: {
                  type: 'string',
                },
              },
            },
          },
        },
        BaseStyleOrRegExp: {
          oneOf: [
            {$ref: '#/definitions/BaseStyle'},
            {$ref: '#/definitions/RegExp'},
          ],
        },
        StringOrRegExp: {
          oneOf: [
            {type: 'string'},
            {$ref: '#/definitions/RegExp'},
          ],
        },
        ArrayOfStringOrRegExp: {
          type: 'array',
          items: {$ref: '#/definitions/StringOrRegExp'},
        },
      },
      properties: {
        baseStyle: {$ref: '#/definitions/BaseStyleOrRegExp'},
        ignoreCalls: {
          type: 'boolean',
          default: true,
        },
        ignoreProperties: {
          type: 'boolean',
          default: false,
        },
        ignoreReadProperties: {
          type: 'boolean',
          default: true,
        },
        ignoredIdentifiers: {$ref: '#/definitions/ArrayOfStringOrRegExp'},
        stripPrefixUnderscores: {
          type: 'boolean',
          default: true,
        },
        stripSuffixUnderscores: {
          type: 'boolean',
          default: true,
        },
        allowedPrefixes: {$ref: '#/definitions/ArrayOfStringOrRegExp'},
        allowedSuffixes: {$ref: '#/definitions/ArrayOfStringOrRegExp'},
      },
      additionalProperties: false,
    },
  },
  create: function(context) {
    function convertArrayOfStringOrRegExp(iv) {
      let rv;

      if (Array.isArray(iv)) {
        rv = iv.map(function(elt) {
          if ('object' === typeof elt) { // ESTree RegExpLiteral ok
            return new RegExp(elt.regex.pattern, elt.regex.flags || '');
          }
          return elt; // string values OK
        });
      }
      return rv;
    }

    function passCamelCase(id) {
      if (0 > id.indexOf('_')) {
        return true;
      }
      return (id.toUpperCase() === id);
    }

    const options = context.options[0] || {};

    let baseStyle = options.baseStyle;
    let baseRegExp;
    if (undefined === baseStyle) {
      baseStyle = 'camelcase';
    }
    let passBaseStyle = passCamelCase;
    if ('camelcase' !== baseStyle) {
      baseRegExp = new RegExp(baseStyle.regex.pattern, baseStyle.regex.flags || '');
      passBaseStyle = function(id) {
        return baseRegExp.test(id);
      };
    }

    const matchPrefixUnderscoresRegExp = /^_+/;
    let stripPrefixUnderscores = options.stripPrefixUnderscores;
    if (undefined === stripPrefixUnderscores) {
      stripPrefixUnderscores = true;
    }

    const matchSuffixUnderscoresRegExp = /_+$/;
    let stripSuffixUnderscores = options.stripSuffixUnderscores;
    if (undefined === stripSuffixUnderscores) {
      stripSuffixUnderscores = true;
    }

    let ignoreCalls = options.ignoreCalls;
    if (undefined === ignoreCalls) {
      ignoreCalls = true;
    }

    let ignoreProperties = options.ignoreProperties;
    if (undefined === ignoreProperties) {
      ignoreProperties = false;
    }

    let ignoreReadProperties = options.ignoreReadProperties;
    if (undefined === ignoreReadProperties) {
      ignoreReadProperties = true;
    }

    const ignoredIdentifiers = convertArrayOfStringOrRegExp(options.ignoredIdentifiers);
    function isIgnoredIdentifier(id) {
      let i;
      const len = ignoredIdentifiers.length;
      let ignore = false;
      let exception;

      for (i = 0; (i < len) && !ignore; ++i) {
        exception = ignoredIdentifiers[i];
        if ('string' === typeof exception) {
          ignore = (exception === id);
        } else {
          ignore = exception.test(id);
        }
      }
      return ignore;
    }

    const allowedPrefixes = convertArrayOfStringOrRegExp(options.allowedPrefixes);
    function startAfterStringPrefix(value, prefix) {
      const start = prefix.length;

      if (start >= value.length) {
        return -1;
      }
      if (value.substr(0, prefix.length) !== prefix) {
        return -1;
      }
      return start;
    }
    function startAfterRegExpPrefix(value, prefix) {
      const match = prefix.exec(value);

      if (!match) {
        return -1;
      }
      if (0 !== match.index) {
        return -1;
      }
      return match[0].length;
    }
    function removePrefix(value) {
      let i;
      const len = allowedPrefixes.length;

      for (i = 0; i < len; ++i) {
        const prefix = allowedPrefixes[i];
        let start;

        if ('string' === typeof prefix) {
          start = startAfterStringPrefix(value, prefix);
        } else {
          start = startAfterRegExpPrefix(value, prefix);
        }
        if (0 < start) {
          value = value.substr(start);
          break;
        }
      }
      return value;
    }

    const allowedSuffixes = convertArrayOfStringOrRegExp(options.allowedSuffixes);
    function endBeforeStringSuffix(value, suffix) {
      const ends = value.length - suffix.length;
      if (0 >= ends) {
        return -1;
      }
      if (value.substr(ends) !== suffix) {
        return -1;
      }
      return ends;
    }
    function endBeforeRegExpSuffix(value, suffix) {
      const match = suffix.exec(value);
      if (!match) {
        return -1;
      }

      const ends = match.index;
      if ((ends + match[0].length) !== value.length) {
        return -1;
      }
      return ends;
    }
    function removeSuffix(value) {
      let i;
      const len = allowedSuffixes.length;
      for (i = 0; i < len; ++i) {
        const suffix = allowedSuffixes[i];
        let ends;

        if ('string' === typeof suffix) {
          ends = endBeforeStringSuffix(value, suffix);
        } else {
          ends = endBeforeRegExpSuffix(value, suffix);
        }
        if (0 < ends) {
          value = value.substr(0, ends);
          break;
        }
      }
      return value;
    }

    function stripAffixes(name) {
      if (stripPrefixUnderscores) {
        name = name.replace(matchPrefixUnderscoresRegExp, '');
      }
      if (stripSuffixUnderscores) {
        name = name.replace(matchSuffixUnderscoresRegExp, '');
      }
      if (allowedPrefixes) {
        name = removePrefix(name);
      }
      if (allowedSuffixes) {
        name = removeSuffix(name);
      }
      return name;
    }

    return {
      Identifier: function(node) {
        let id = node.name;

        // Ignore any identifiers that are specifically excluded.
        if (ignoredIdentifiers && isIgnoredIdentifier(id)) {
          return;
        }

        // Strip affixes, then check whether the ID has been totally
        // eliminated or if it matches the base style.  In either case
        // there is nothing to diagnose.
        id = stripAffixes(id);
        if (('' === id) || passBaseStyle(id)) {
          return;
        }

        // Doesn't match.  Look at its context to see whether
        // diagnostics are inhibited.  The logic here is about the
        // same as ESLint's camelcase but maybe a bit more precise.
        const parent = node.parent;
        do {
          if ('MemberExpression' === parent.type) {
            // Always report a non-conforming object identifier
            if (parent.object === node) {
              break;
            }

            // Fast-exit when we don't diagnose properties
            if (ignoreProperties) {
              return;
            }
            // From here on must be in the member expression.

            if ('AssignmentExpression' !== parent.parent.type) {
              // Diagnose read usage if requested
              if (ignoreReadProperties) {
                return;
              }
              break;
            }
            // From here on must be on left or right of an assignment.

            // Conditionally ignore read
            if (ignoreReadProperties
                && (parent.parent.right === parent)) {
              return;
            }
          } else if ('Property' === parent.type) {
            if (ignoreProperties
                && (node === parent.key)) {
              return;
            }
          } else if ('CallExpression' === parent.type) {
            if (ignoreCalls) {
              return;
            }
          } else {
          }
        } while (false);
        context.report(node, 'Identifier \'' + node.name + '\' does not conform.');
      },
    };
  },
};
