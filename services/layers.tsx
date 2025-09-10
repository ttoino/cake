import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

import { entries } from "../lib/objects";
import Layer from "../widgets/Layer";
import Bar from "../windows/Bar";
import Main from "../windows/Main";
import Popups from "../windows/Popups";
import Scrim from "../windows/Scrim";

export const LAYERS = {
    bar: Bar,
    main: Main,
    popups: Popups,
    scrim: Scrim,
} as const satisfies Record<string, typeof Layer>;

export type LayerName = keyof typeof LAYERS;

export const init = () => {
    const monitors = createBinding(app, "monitors");

    for (const [name, Layer] of entries(LAYERS))
        <For cleanup={(win) => (win as Gtk.Window)?.destroy()} each={monitors}>
            {(monitor) => (
                <Layer
                    class={name}
                    gdkmonitor={monitor}
                    name={`${name}-${monitor.model}`}
                    namespace={`cake-${name}`}
                />
            )}
        </For>;
};
