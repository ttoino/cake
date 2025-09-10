import { Accessor, createComputed } from "ags";

import { filterNonNull } from "./arrays";
import { accessor } from "./state";

export const mergeClass = (
    ...classes: (Accessor<string> | string | undefined)[]
): Accessor<string> =>
    createComputed(filterNonNull(classes).map(accessor), (...classes) =>
        classes.join(" "),
    );
