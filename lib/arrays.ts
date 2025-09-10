export const filterNonNull = <T>(arr: T[]): Exclude<T, null | undefined>[] =>
    arr.filter((t) => t !== null && t !== undefined) as Exclude<
        T,
        null | undefined
    >[];
