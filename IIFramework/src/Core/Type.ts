namespace numas {
    export type Constructor<T = unknown> = new (...args: any[]) => T;
    export type VoidFunction = () => void;
    export type New<T> = new() => T;
    export type Action<T> = (elem: T) => void;
    export type Func<T, RETURN> = (elem: T) => RETURN;
    export type Predicate<T> = (elem: T) => boolean;
    export type ValueChangedFunc<T> = (cur: T, pre: T) => void;
    export type Resolve<T> = (value?: T) => void;
    export type Resolve2<T, S> = (value: T, t: S) => void;
    export type Reject<T> = (reason?: T) => void;
    export type StringKeyDict<V> = {[key: string]: V}
}
