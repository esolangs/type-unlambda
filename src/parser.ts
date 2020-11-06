/**
 * parser.ts - Unlambda parser.
 * 
 * @author CismonX <admin@cismon.net>
 * @license MIT
 */

import { Application, Expression, FuncChar, FuncNoChar } from './language';

/**
 * Parse result is a tuple `[E, R]`, where `E` is the parsed expression, and `R` is the unparsed code fragment.
 * 
 * If `E` is `never`, or `R` is not `''`, the Unlambda code given to the parser is malformed.
 */
export type ParseResult = [Expression, string];

/**
 * Parse the given Unlambda code. Returns a `ParseResult`.
 */
export type Parse<Code extends string> =
    // `C` is the first character of the code, `R` is the rest.
    Code extends `${infer C}${infer R}` ?
        // Trim comment line.
        C extends '#' ? Parse<R extends `${infer _}\n${infer N}` ? N : ''>
        // Trim whitespace.
      : C extends ' ' | '\n' | '\t' ? Parse<R>
        // Apply the result of two consective parse.
      : C extends '`' ? ParseApply<Parse<R>>
        // A single character function.
      : C extends FuncNoChar ? [C, R]
        // A `.x` or `?x` function.
      : R extends `${infer C1}${infer R1}` ? `${C}${C1}` extends FuncChar ? [`${C}${C1}`, R1] : [never, R]
      : [never, R]
  : [never, Code];

/**
 * Given the left part (the "operator") of an application, parse the right part (the "operand").
 */
type ParseApply<L extends ParseResult> = ParseApplyResult<L[0], Parse<L[1]>>;

/**
 * Given the parse result of two parts of an application, return the final parse result.
 */
type ParseApplyResult<L extends Expression, R extends ParseResult> = [Application<L, R[0]>, R[1]];
