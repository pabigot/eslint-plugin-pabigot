# Enforce Identifier Style with Affix Exceptions (affixed-ids)

This rule generalizes the ESLint
[camelcase](http://eslint.org/docs/rules/camelcase) and
[id-match](http://eslint.org/docs/rules/id-match) rules by combining
them with options to ignore metadata encoded in prefixes and suffixes.

## Rationale

Requiring consistent lexical restrictions for identifiers is common in
many style guides.  Perhaps the most common restriction in current
practice is camel case: mixed case identifiers, where the capitalization
of the first letter is semantically significant.  A common exception is
for constants, which are entirely upper-case and so introduce a
non-alphanumeric character (generally underscore) to separate semantic
components.

Well and good, but these rules often disallow extending the use of the
non-alphanumeric character to separate the identifier from restricted
semantic metadata (as in [apps Hungarian
notation](https://en.wikipedia.org/wiki/Hungarian_notation#Systems_vs._Apps_Hungarian).

Such is the case with [ESLint][].  The `affixed-ids` rule addresses the
need discussed in [ESLint issue 6524](https://github.com/eslint/eslint/issues/6524), to wit a
requirement that variables and properties holding measurements identify
in their name the physical unit of the measurement.

### Examples

The following rule specification is intended to support the [Google
naming style](https://google.github.io/styleguide/javascriptguide.xml?showone=Naming#Naming):

    "pabigot/affixed-ids": ["error", {
      "baseStyle": "camelcase",
      "allowedSuffixes": ["_opt"],
      "ignoredIdentifiers": ["var_args"]
    }]

The following rule specification supports code that records durations,
temperatures, and frequencies with units identified per the [Unified
Code for Units of Measure](http://unitsofmeasure.org/ucum.html):

    "pabigot/affixed-ids": ["error", {
      "allowedSuffixes": [{regex: {pattern: "_[mu]?s"}},
                          {regex: {pattern: "_[dc]?Cel"}},
                          {regex: {pattern: "_[kMG]?Hz"}}]
    }]

## Options

### baseStyle

This option specifies the preferred identifier style as one of the
following:

* the string `camelcase` identifies a style intended to match ESLint
  [camelcase][]
* an ESTree [RegExpLiteral][] value providing functionality similar to
  ESLint [id-match][]

If left unspecified `camelcase` will be used.

### ignoreCalls

This boolean option specifies whether identifier style applies to
function calls.  For conformance with ESLint `camelcase` (where it is
unconditional) it defaults to `true`.

### ignoreProperties

This boolean option specifies whether identifier style applies to object
properties, essentially the same as the `properties` option of
[camelcase][].  For conformance with ESLint it defaults to `false`.

### ignoreReadProperties

This boolean option specifies whether identifier style applies to object
properties that are being read (e.g. provided by an external package
with different identifier conventions).  For conformance with ESLint
`camelcase` (where it is unconditional) the default value is `true`.

### ignoredIdentifiers

This array option accepts a sequence of string or [RegExpLiteral][]
values used to match identifiers that will never be reported.  Any
identifier that exactly equals a string in the option, or that can be
matched by regex in the option, is accepted regardless of affix or base
style.  The default is an empty array.

### stripPrefixUnderscores

This boolean option specifies whether underscore characters that appear
at the start of the identifier are stripped before style checking.  For
conformance with ESLint `camelcase` (where it is unconditional) the
default value is `true`.

### stripSuffixUnderscores

This boolean option specifies whether underscore characters that appear
at the end of the identifier are stripped before style checking.  For
conformance with ESLint `camelcase` (where it is unconditional) the
default value is `true`.

### allowedPrefixes

This array option accepts a sequence of string or [RegExpLiteral][]
values used to match identifier prefixes that are stripped before style
checking.  If the identifier begins with string in the option, or if a
regex in the option matches at the start of the identifier, the matched
material is removed from the checked identifier.  Remove of a prefix
cannot result in an empty identifier.

### allowedSuffixes

This array option accepts a sequence of string or [RegExpLiteral][]
values used to match identifier suffixes that are stripped before style
checking.  If the identifier ends with string in the option, or if a
regex in the option matches at the end of the identifier, the matched
material is removed from the checked identifier.  Remove of a suffix
cannot result in an empty identifier.

[ESLint]: http://eslint.org
[camelcase]: http://eslint.org/docs/rules/camelcase
[id-match]: http://eslint.org/docs/rules/id-match
[RegExpLiteral]: https://github.com/estree/estree/blob/master/spec.md#regexpliteral
