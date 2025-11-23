import { Accessor } from "ags";
import { GType, Object, register } from "ags/gobject";
import { Gtk } from "ags/gtk4";
import Gio from "gi://Gio";

import { accessor } from "../lib/state";

@register({
    GTypeName: "AccessorListModel",
    Implements: [Gio.ListModel],
})
export class AccessorListModel<T extends Object>
    extends Object
    implements Gio.ListModel<T>
{
    declare items_changed: (
        position: number,
        removed: number,
        added: number,
    ) => void;

    #array: T[];
    #dispose: () => void;
    #items: Accessor<T[]>;
    #type: GType<T>;

    constructor(items: Accessor<T[]>, type: GType<T>) {
        super();
        this.#array = items.get();
        this.#items = items;
        this.#type = type;

        this.#dispose = this.#items.subscribe(() => {
            const newArray = this.#items.get();
            this.items_changed(0, this.#array.length, newArray.length);
            this.#array = newArray;
        });
    }

    get_item(position: number): null | T {
        return this.#array[position] ?? null;
    }
    get_item_type() {
        return this.#type;
    }
    get_n_items(): number {
        return this.#array.length;
    }

    // Virtual functions

    vfunc_dispose(): void {
        super.vfunc_dispose();
        this.#dispose();
    }

    vfunc_get_item(position: number): null | T {
        return this.get_item(position);
    }

    vfunc_get_item_type() {
        return this.get_item_type();
    }

    vfunc_get_n_items(): number {
        return this.get_n_items();
    }
}

export type ListProps<T extends Object> = {
    items: Accessor<T[]> | T[];
    itemType: GType<T>;
    renderer: (item: T) => JSX.Element;
    sort?: (a: T, b: T) => number;
};

export default function List<T extends Object>({
    items,
    itemType,
    renderer,
    sort,
}: ListProps<T>) {
    let model: Gio.ListModel = new AccessorListModel(accessor(items), itemType);

    if (sort) {
        const sorter = Gtk.CustomSorter.new(sort);
        model = new Gtk.SortListModel({
            model,
            sorter,
        });
    }

    const factory = new Gtk.SignalListItemFactory();
    factory.connect("bind", (_factory, listItem: Gtk.ListItem) => {
        const item = listItem.get_item<T>();
        listItem.set_child(renderer(item) as Gtk.Widget);
    });

    return (
        <Gtk.ListView
            factory={factory}
            model={new Gtk.NoSelection({ model })}
        />
    );
}
