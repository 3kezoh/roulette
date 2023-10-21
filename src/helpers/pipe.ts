type Fn = (...arg: any) => any;

type FirstParameter<T extends Fn> = Parameters<T>[0];

type PipeArgs<T extends Fn[], U extends Fn[] = []> = T extends [
  (...args: infer A) => infer B
]
  ? [...U, (...args: A) => B]
  : T extends [(...args: infer A) => any, ...infer Tail]
  ? Tail extends [(arg: infer B) => any, ...any[]]
    ? PipeArgs<Tail, [...U, (...args: A) => B]>
    : U
  : U;

export function pipe<T extends Fn, U extends Fn[]>(
  arg: FirstParameter<T>,
  firstFn: T,
  ...fns: PipeArgs<U> extends U ? U : PipeArgs<U>
) {
  return fns.reduce((acc, fn) => fn(acc), firstFn(arg));
}
