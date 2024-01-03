export type InterceptorFunction<T> = (this: T, value: unknown) => unknown;

export function interceptor<T>(
    before: InterceptorFunction<T> | undefined,
    after: InterceptorFunction<T>
): InterceptorFunction<T> {
    if (typeof before === 'function') {
        return after;
    }
    return function (this: T, value: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return after.call(this, before!.call(this, value));
    };
}
