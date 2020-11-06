/**
 * index.ts - Unlambda interpreter entry.
 * 
 * @author CismonX <admin@cismon.net>
 * @license MIT
 */

import { Parse, ParseResult } from './parser';
import { Eval } from './runtime';

/**
 * Get the parse result expression, or `never` if parse failed.
 */
type ParseResultValue<T extends ParseResult> = T[1] extends '' ? T[0] : never;

/**
 * Get the output string of an evalalutation result, or `never` if evaluation failed.
 */
type EvalResultOutput<T> = T extends [infer F, [infer I, infer O, infer C]] ? O : never;

/**
 * Given the source code of an Unlambda program, and input string.
 * 
 * Returns the output of program execution, or `never` if something went wrong.
 */
type Unlambda<Code extends string, Input extends string = ''> = 
    EvalResultOutput<Eval<ParseResultValue<Parse<Code>>, [], [Input, '', '']>>;

export default Unlambda;
