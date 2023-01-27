# eye-js
EYE reasoning in JavaScript with WebAssembly solving your n3 reasoning with client side Prolog execution

## Usage

Install the package via NPM
```
npm install @smessie/eye-js
```

Import and use the function in your code
```javascript
import { n3reasoner} from 'eye-js';

const data = `
@prefix : <urn:example.org:> .
:Alice a :Person .
{ ?S a :Person } => { ?S a :Human } .
`;

const query = `{?S ?P ?O . } => {?S ?P ?O . } .`;

const options = { output: "derivations", blogic: "false" };

const result = await n3reasoner(data, query, options);
```

### Options

The `options` parameter is optional and can be used to configure the reasoning process. The following options are available:
- `output`: What to output.
    - `derivations`: output only new derived triples, a.k.a `--pass-only-new` (default)
    - `deductive_closure`: output deductive closure, a.k.a `--pass`
    - `deductive_closure_plus_rules`: output deductive closure plus rules, a.k.a `--pass-all`
    - `grounded_deductive_closure_plus_rules`: ground the rules and output deductive closure plus rules, a.k.a `--pass-all-ground`
- `blogic`: Whether to use the blogic or not. Used to support RDF surfaces.
    - `true`: use blogic
    - `false`: do not use blogic (default)


## How this works

This package is a wrapper around the [eyereasoner/eye-js](https://github.com/eyereasoner/eye-js) package and makes it to be in line with the [eye-mock](https://github.com/smessie/eye-mock) package having the same interface, more on this below.

It is thus an EYE reasoner to be used in the browser or Node, built with the technology of SWI-Prolog in the browser using WebAssembly.

Pass your data and query as n3 strings to the `n3reasoner` function, and it will return the resulting triples as a n3 string.

## Server version

Need for more computation power? Check out [eye-mock](https://github.com/smessie/eye-mock) which is a server version of this package. It works with the same interface and is a drop-in replacement. Just change your import from `eye-js` to `eye-mock` and profit from the server power.
