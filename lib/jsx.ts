import { Accessor, createComputed } from "ags";

import { filterNonNull } from "./arrays";
import { accessor } from "./state";

export const mergeClass = (
    ...classes: (
        | Accessor<string>
        | Accessor<string | undefined>
        | string
        | undefined
    )[]
): Accessor<string> =>
    createComputed(classes.map(accessor), (...classes) =>
        filterNonNull(classes).join(" "),
    );
