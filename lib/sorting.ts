export const ascending = <T extends boolean | Date | number | string>(
    a: T,
    b: T,
) => {
    switch (typeof a) {
        case "boolean":
            return (a ? 1 : 0) - (b ? 1 : 0);
        case "number":
            return a - (b as number);
        case "object":
            return a.getTime() - (b as Date).getTime();
        case "string":
            return a.localeCompare(b as string);
    }
};

export const descending = <T extends boolean | Date | number | string>(
    a: T,
    b: T,
) => ascending(b, a);
