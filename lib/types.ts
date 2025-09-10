export type Filter<T extends object, V> = {
    [K in keyof T as T[K] extends V ? K : never]: T[K];
};

export type SomeRequired<T extends object, K extends keyof T> = Omit<T, K> &
    Required<Pick<T, K>>;
