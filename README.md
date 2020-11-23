# README

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

type-unlambda - [Unlambda](http://www.madore.org/~david/programs/unlambda) interpreter implemented in TypeScript's type system

## Getting Started

Installation:

```sh
npm install --save-dev typescript
npm install --save-dev @esolangs/type-unlambda
```

Usage:

```typescript
import Unlambda from '@esolangs/type-unlambda';

type Code = '``@c`d``s`|k`@c';
type Input = 'Hello!';
type Output = Unlambda<Code, Input>; // Output == '!olleH'
```

Screenshots:

![Reverse print string](https://user-images.githubusercontent.com/19173506/98339205-4efdfd80-2046-11eb-880d-f2b2333d61a0.png)

## Notes

You're likely to get the following error when trying to run a program with type-unlambda:

> Type instantiation is excessively deep and possibly infinite.ts(2589).

To write loops in TypeScript's type system, we have to use recursions, like we do in other purely functional programming languages. Meanwhile, we use [CPS](https://en.wikipedia.org/wiki/Continuation-passing_style) to implement continuations, which also introduces heavy recursion. However, TypeScript's type system is not meant for general purpose programming, and recursion has its limits.

In [src/compiler/checker.ts](https://raw.githubusercontent.com/microsoft/TypeScript/release-4.1/src/compiler/checker.ts), there is a hard-coded limit for type instantiation:

```typescript
if (instantiationDepth === 50 || instantiationCount >= 5000000) {
    // ...
    return errorType;
}
```

You may expect that there is an option somewhere that this limit can be configured, like `-ftemplate-depth=n` in gcc/clang. Unfortunately, there isn't, [and it's likely to stay that way](https://github.com/microsoft/TypeScript/pull/29602).

To workaround this limitation, we modify the code of `tsserver` or `tsc` in `node_modules` until the error no longer applies. Changing `instantiationDepth` to `1000` is sufficient to run the example above.
