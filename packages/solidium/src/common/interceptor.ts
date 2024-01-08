export type InterceptorFunction<T> = (
    this: T,
    oldValue: unknown,
    newValue: unknown
) => unknown;

export function interceptor<T>(
    before: InterceptorFunction<T> | undefined,
    after: InterceptorFunction<T>
): InterceptorFunction<T> {
    if (typeof before !== 'function') {
        return after;
    }
    return function (this: T, oldValue: unknown, newValue: unknown) {
        return after.call(
            this,
            oldValue,
            before.call(this, oldValue, newValue)
        );
    };
}
