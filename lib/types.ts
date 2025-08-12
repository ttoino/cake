export type Filter<T extends object, V> = {
    [K in keyof T as T[K] extends V ? K : never]: T[K];
};
