/**
 * runtime.ts - Unlambda runtime.
 * 
 * @author CismonX <admin@cismon.net>
 * @license MIT
 */

import {
    Char, Func, GetFuncChar,
    FuncS, FuncK, FuncI, FuncV, FuncC, FuncD, FuncE, FuncR, FuncRead, FuncPipe, FuncPrint, FuncComp
} from './language';

/**
 * Concatenate two strings.
 */
type Concat<S1, S2> = S1 extends string ? S2 extends string ? `${S1}${S2}` : never : never;

/**
 * Apply a continuation to a function.
 */
type Continue<Cont, F /* extends Func */, IO> =
    // The left part of application is evalutated.
    Cont extends ['a1', infer R, infer Cont1] ?
        // Function `d` delays the evaluation and stores the operand expression `F` in a promise `` `dF ``.
        F extends FuncD ? Continue<Cont1, ['d1', R], IO>
        // Evalutate the right part (the "operand") of application.
      : Eval<R, ['a2', F, Cont1], IO>
    // Apply the operator to the operand, both evaluated.
  : Cont extends ['a2', infer R, infer Cont1] ? Apply<R, F, Cont1, IO>
    // Evaluation is completed.
  : [F, IO];

/** 
 * Apply function `L` to `R`.
 */
type Apply<L /* extends Func */, R /* extends Func */, Cont, IO> =
    // `I` is the input string, `O` the output string, and `C` the "current character".
    IO extends [infer I, infer O, infer C] ?
        // Function `k` takes an argument `X` and returns `` `kX ``.
        L extends FuncK ? Continue<Cont, ['k1', R], IO>
        // Function `s` takes an argument `X` and returns `` `sX ``.
      : L extends FuncS ? Continue<Cont, ['s1', R], IO>
        // Function `i` takes an argument and returns it.
      : L extends FuncI ? Continue<Cont, R, IO>
        // Function `` `kX `` takes an argument, ignores it and returns `X`.
      : L extends ['k1', infer X] ? Continue<Cont, X, IO>
        // Function `` `sX `` takes an argument `Y` and returns ` ``sXY `.
      : L extends ['s1', infer X] ? Continue<Cont, ['s2', X, R], IO>
        // Function ` ``sXY ` takes an argument `Z` and returns ``` ``XZ`YZ ```.
      : L extends ['s2', infer X, infer Y] ? Eval<[[X, R], [Y, R]], Cont, IO>
        // Function `c` takes an argument `X` and returns `` `X<cont> `` where `<cont>` is the current continuation,
        // or the value passed to `<cont>` if the latter is applied.
      : L extends FuncC ? Eval<[R, ['c1', Cont]], Cont, IO>
        // A continuation takes and argument `X` and jump to the point in history where function `c` was called,
        // making `c` returns `X`.
      : L extends ['c1', infer Cont1] ? Continue<Cont1, R, IO>
        // Function `` `dE `` takes an argument `Y` and evaluates `E`, giving a function `X`, and returns `` `XY ``.
      : L extends ['d1', infer E] ? Eval<[E, R], Cont, IO>
        // Function `v` takes an argument and returns `v`.
      : L extends FuncV ? Continue<Cont, FuncV, IO>
        // Function `.x` works like `i` with the side affect of printing a character `x`.
      : L extends FuncPrint ? Continue<Cont, R, [I, Concat<O, GetFuncChar<L>>, C]>
        // Function `r` is an alias for function `.<\n>` (a dot followed by a newline).
      : L extends FuncR ? Continue<Cont, R, [I, Concat<O, '\n'>, C]>
        // Function `@` takes an argument `X`, read a character from input, make it the "current character",
      : L extends FuncRead ? I extends `${infer C1}${infer R1}` ?
            // returns `` `Xi `` if the character is successfully read,
            Eval<[R, FuncI], Cont, [R1, O, C1]>
            // or `` `Xv `` if not.
          : Eval<[R, FuncV], Cont, ['', O, '']>
        // Function `?x` takes an argument `X` and returns `` `Xi `` if "current character" is `x`, or `` `Xv `` if not.
      : L extends FuncComp ? Eval<[R, GetFuncChar<L> extends C ? FuncI : FuncV], Cont, IO>
        // Function `|` takes an argument `X` and returns `` `X.x `` where `x` is the "current character",
        // or `` `Xv `` if there's no "current character".
      : L extends FuncPipe ? Eval<[R, C extends Char ? `.${C}` : FuncV], Cont, IO>
        // Function `e` takes an argument `X` and exits the program, pretending the evaluation result is `X`.
      : L extends FuncE ? [R, IO]
      : never
  : never;

/**
 * Evalutate an expression.
 */
export type Eval<E /* extends Expression */, Cont, IO> =
      // Expression is a function, 
      E extends Func ? Continue<Cont, E, IO>
      // Expression is an application, evalutate the left part (the "operator").
    : E extends [infer L, infer R] ? Eval<L, ['a1', R, Cont], IO>
    : never;
