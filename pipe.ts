/**
 * Applies functions over value from left to right.
 * @param value - The initial value to pipe
 * @param fns - The functions to pipe the value through
 * @returns The final value after all functions have been applied
 */
export function pipe<A>(value: A): A;
export function pipe<A, B>(value: A, fn1: (input: A) => B): B;
export function pipe<A, B, C>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
): C;
export function pipe<A, B, C, D>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
): D;
export function pipe<A, B, C, D, E>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
): E;
export function pipe<A, B, C, D, E, F>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
): F;
export function pipe<A, B, C, D, E, F, G>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
): G;
export function pipe<A, B, C, D, E, F, G, H>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
): H;
export function pipe<A, B, C, D, E, F, G, H, I>(
  value: A,
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
): I;
export function pipe(
  value: unknown,
  ...fns: Array<(arg: unknown) => unknown>
): unknown;
export function pipe(
  value: unknown,
  ...fns: Array<(arg: unknown) => unknown>
): unknown {
  for (const fn of fns) {
    value = fn(value);
  }
  return value;
}

/**
 * Composes functions from left to right
 * @param fns - The functions to compose
 * @returns A function that applies the composed functions in order
 */
export function flow<A>(fn1: (input: A) => A): (input: A) => A;
export function flow<A, B>(fn1: (input: A) => B): (input: A) => B;
export function flow<A, B, C>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
): (input: A) => C;
export function flow<A, B, C, D>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
): (input: A) => D;
export function flow<A, B, C, D, E>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
): (input: A) => E;
export function flow<A, B, C, D, E, F>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
): (input: A) => F;
export function flow<A, B, C, D, E, F, G>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
): (input: A) => G;
export function flow<A, B, C, D, E, F, G, H>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
): (input: A) => H;
export function flow<A, B, C, D, E, F, G, H, I>(
  fn1: (input: A) => B,
  fn2: (input: B) => C,
  fn3: (input: C) => D,
  fn4: (input: D) => E,
  fn5: (input: E) => F,
  fn6: (input: F) => G,
  fn7: (input: G) => H,
  fn8: (input: H) => I,
): (input: A) => I;
export function flow(
  ...fns: Array<(arg: unknown) => unknown>
): (arg: unknown) => unknown;
export function flow(
  ...fns: Array<(arg: unknown) => unknown>
): (arg: unknown) => unknown {
  return (value: unknown) => pipe(value, ...fns);
}

/** An awaitable value (a value that is either T or a promise for T) */
export type Awaitable<T> = T | Promise<T>;

/**
 * Applies sync or async functions over value from left to right.
 * @param value - The initial value to pipe
 * @param fns - The functions to pipe the value through
 * @returns a promise for final value after all functions have been applied
 */
export function pipeAsync<A>(value: A): Promise<A>;
export function pipeAsync<A, B>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
): Promise<B>;
export function pipeAsync<A, B, C>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
): Promise<C>;
export function pipeAsync<A, B, C, D>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
): Promise<D>;
export function pipeAsync<A, B, C, D, E>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
): Promise<E>;
export function pipeAsync<A, B, C, D, E, F>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
): Promise<F>;
export function pipeAsync<A, B, C, D, E, F, G>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
  fn6: (input: F) => Awaitable<G>,
): Promise<G>;
export function pipeAsync<A, B, C, D, E, F, G, H>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
  fn6: (input: F) => Awaitable<G>,
  fn7: (input: G) => Awaitable<H>,
): Promise<H>;
export function pipeAsync<A, B, C, D, E, F, G, H, I>(
  value: A,
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
  fn6: (input: F) => Awaitable<G>,
  fn7: (input: G) => Awaitable<H>,
  fn8: (input: H) => Awaitable<I>,
): Promise<I>;
export async function pipeAsync(
  value: unknown,
  ...fns: Array<(arg: unknown) => Awaitable<unknown>>
): Promise<unknown>;
export async function pipeAsync(
  value: unknown,
  ...fns: Array<(arg: unknown) => Awaitable<unknown>>
): Promise<unknown> {
  for (const fn of fns) {
    value = await fn(value);
  }
  return value;
}

/**
 * Composes async or sync functions from left to right
 * @param fns - The functions to compose
 * @returns A function that applies the composed functions in left-to-right order
 */
export function flowAsync<A>(
  fn1: (input: A) => Awaitable<A>,
): (input: A) => Promise<A>;
export function flowAsync<A, B>(
  fn1: (input: A) => Awaitable<B>,
): (input: A) => Promise<B>;
export function flowAsync<A, B, C>(
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
): (input: A) => Promise<C>;
export function flowAsync<A, B, C, D>(
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
): (input: A) => Promise<D>;
export function flowAsync<A, B, C, D, E>(
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
): (input: A) => Promise<E>;
export function flowAsync<A, B, C, D, E, F>(
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
): (input: A) => Promise<F>;
export function flowAsync<A, B, C, D, E, F, G>(
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
  fn6: (input: F) => Awaitable<G>,
): (input: A) => Promise<G>;
export function flowAsync<A, B, C, D, E, F, G, H>(
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
  fn6: (input: F) => Awaitable<G>,
  fn7: (input: G) => Awaitable<H>,
): (input: A) => Promise<H>;
export function flowAsync<A, B, C, D, E, F, G, H, I>(
  fn1: (input: A) => Awaitable<B>,
  fn2: (input: B) => Awaitable<C>,
  fn3: (input: C) => Awaitable<D>,
  fn4: (input: D) => Awaitable<E>,
  fn5: (input: E) => Awaitable<F>,
  fn6: (input: F) => Awaitable<G>,
  fn7: (input: G) => Awaitable<H>,
  fn8: (input: H) => Awaitable<I>,
): (input: A) => Promise<I>;
export function flowAsync(
  ...fns: Array<(arg: unknown) => Awaitable<unknown>>
): (arg: unknown) => Promise<unknown>;
export function flowAsync(
  ...fns: Array<(arg: unknown) => Awaitable<unknown>>
): (arg: unknown) => Promise<unknown> {
  return (value: unknown) => pipeAsync(value, ...fns);
}
