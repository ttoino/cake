export const entries = <K extends string, V>(object: Record<K, V>): [K, V][] =>
    Object.entries<V>(object) as [K, V][];
