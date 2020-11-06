/**
 * language.ts - Definitions and utilities related to the Unlambda language.
 * 
 * @author CismonX <admin@cismon.net>
 * @license MIT
 */

/**
 * Character which is readable and printable by Unlambda programs.
 */
export type Char =
    | '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G'
    | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X'
    | 'Y' | 'Z' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o'
    | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z' | ' ' | '!' | '"' | '#' | '$' | '%'
    | '&' | "'" | '(' | ')' | '*' | '+' | ',' | '-' | '.' | '/' | ':' | ';' | '<' | '=' | '>' | '?' | '@'
    | '[' | ']' | '^' | '_' | '`' | '{' | '|' | '}' | '~' | '\\' | '\n';

/**
 * A single character function.
 */
export type FuncNoChar = FuncS | FuncK | FuncI | FuncV | FuncC | FuncD | FuncE | FuncR | FuncRead | FuncComp | FuncPipe;
export type FuncS = 's' | 'S';
export type FuncK = 'k' | 'K';
export type FuncI = 'i' | 'I';
export type FuncV = 'v' | 'V';
export type FuncC = 'c' | 'C';
export type FuncD = 'd' | 'D';
export type FuncE = 'e' | 'E';
export type FuncR = 'r' | 'R';
export type FuncRead = '@';
export type FuncPipe = '|';

/**
 * A function which holds a character.
 */
export type FuncChar = FuncPrint | FuncComp;
export type FuncPrint = `.${Char}`;
export type FuncComp = `?${Char}`;

/**
 * A primitive function.
 */
export type PrimitiveFunc = FuncNoChar | FuncChar;

/**
 * A function obtained by curry-ing primitive functions.
 */
export type CurriedFunc = FuncK1 | FuncS1 | FuncS2 | FuncC1 | FuncD1;
export type FuncK1 = ['k1', Func];
export type FuncS1 = ['s1', Func];
export type FuncS2 = ['s2', Func, Func];
export type FuncC1 = ['c1', any];
export type FuncD1 = ['d1', Expression];

/**
 * An Unlambda builtin function.
 */
export type Func = PrimitiveFunc | CurriedFunc;

/**
 * Get the holding character of a function.
 */
export type GetFuncChar<S extends FuncChar> = S extends `${infer _}${infer U}` ? U : never;

/**
 * An expression is either a function or an application of two expressions.
 */
export type Expression = [Expression, Expression] | Func;

/**
 * An application of two expressions.
 * 
 * Returns `never` if either expression is invalid.
 */
export type Application<L extends Expression, R extends Expression> = [L, R];
