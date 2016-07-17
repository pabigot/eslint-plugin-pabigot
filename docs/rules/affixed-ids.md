# Enforce Identifier Style with Exceptions (affixed-ids)

This rule generalizes the ESLint
[camelcase](http://eslint.org/docs/rules/camelcase) and
[id-match](http://eslint.org/docs/rules/id-match) rules by combining
them with options to ignore prefix and suffix metadata codes.

## Options

### baseStyle

This option specifies the preferred identifier style:

* `camelcase` aims to match ESLint [camelcase][]
* Other values must be ESTree [RegExpLiteral][] values providing
  extended functionality relative to [id-match][]

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

[camelcase]: http://eslint.org/docs/rules/camelcase
[id-match]: http://eslint.org/docs/rules/id-match
[RegExpLiteral]: https://github.com/estree/estree/blob/master/spec.md#regexpliteral
