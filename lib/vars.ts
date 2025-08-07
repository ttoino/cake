import { Accessor, createState } from "ags";

export const accessor = <T>(v: Accessor<T> | T): Accessor<T> =>
    v instanceof Accessor ? v : createState(v)[0];
