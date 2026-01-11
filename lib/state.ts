import { Accessor, createBinding, createComputed, createState } from "ags";
import GObject from "gi://GObject";

import { Filter } from "./types";

export const accessor = <T>(v: Accessor<T> | T): Accessor<T> =>
    v instanceof Accessor ? v : new Accessor(() => v);

export const createArrayBinding = <
    T extends GObject.Object,
    P extends keyof Filter<T, unknown[]>,
    V,
>(
    object: T,
    property: Exclude<Extract<P, string>, "$signals">,
    mapFn: (value: T[P] extends (infer V)[] ? V : never) => Accessor<V>,
): Accessor<V[]> =>
    flatAccessor(
        createBinding(object, property).as((value) =>
            createComputed(
                (value as unknown[]).map(mapFn as (_: unknown) => Accessor<V>),
            ),
        ),
    );

export const createBooleanBinding = <
    T extends GObject.Object,
    P extends keyof T,
>(
    object: T,
    property: Exclude<Extract<P, string>, "$signals">,
): Accessor<boolean> => createBinding(object, property).as((value) => !!value);

export const createDefaultBinding = <
    T extends GObject.Object,
    P extends keyof T,
>(
    object: T,
    property: Exclude<Extract<P, string>, "$signals">,
    value: Exclude<T[P], null | undefined>,
): Accessor<Exclude<T[P], null | undefined>> =>
    createBinding(object, property).as((v) => v ?? value) as Accessor<
        Exclude<T[P], null | undefined>
    >;

export const flatAccessor = <T>(
    accessor: Accessor<Accessor<T>>,
): Accessor<T> => {
    const [value, setValue] = createState<T>(accessor.get().get());

    const innerSubscribe = () =>
        accessor.get().subscribe(() => setValue(accessor.get().get()));

    let dispose = innerSubscribe();

    accessor.subscribe(() => {
        dispose();
        setValue(accessor.get().get());
        dispose = innerSubscribe();
    });

    return value;
};
