export type InterceptorFunction<T> = (this: T, oldValue: unknown, newValue: unknown) => unknown;

export function interceptor<T>(
    before: InterceptorFunction<T> | undefined,
    after: InterceptorFunction<T>
): InterceptorFunction<T> {
    if (typeof before === 'function') {
        return after;
    }
    return function (this: T, oldValue: unknown, newValue: unknown) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return after.call(this, oldValue, before!.call(this, oldValue, newValue));
    };
}
