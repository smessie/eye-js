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

const query = `{?S ?P ?O} => {?S ?P ?O}`;

const result = await n3reasoner(data,query);
```

Currently, the extra optional `onlyDerivations` parameter is not supported. It will by default only return the derived triples.

## How this works

This package is a wrapper around the [eyereasoner/eye-js](https://github.com/eyereasoner/eye-js) package and makes it to be in line with the [eye-mock](https://github.com/smessie/eye-mock) package having the same interface, more on this below.

It is thus an EYE reasoner to be used in the browser or Node, built with the technology of SWI-Prolog in the browser using WebAssembly.

Pass your data and query as n3 strings to the `n3reasoner` function, and it will return the resulting triples as a n3 string.

## Server version

Need for more computation power? Check out [eye-mock](https://github.com/smessie/eye-mock) which is a server version of this package. It works with the same interface and is a drop-in replacement. Just change your import from `eye-js` to `eye-mock` and profit from the server power.
