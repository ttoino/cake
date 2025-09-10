import { createBinding, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";

import { ascending } from "../lib/sorting";
import Notifications from "../providers/notifications";
import Layer, { type LayerProps } from "../widgets/Layer";
import Notification from "../widgets/Notification";

const notifications = Notifications.get_default();

export default function Popups(props: LayerProps) {
    const popups = createBinding(notifications, "popups").as((ids) =>
        ids.toSorted((a, b) =>
            ascending(
                notifications.get(a)?.time ?? 0,
                notifications.get(b)?.time ?? 0,
            ),
        ),
    );

    return (
        <Layer
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            margin={16}
            {...props}
        >
            <box hexpand orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                <For each={popups}>
                    {(id) => {
                        const notification = notifications.get(id);

                        if (!notification) return <></>;

                        return Notification(
                            notification,
                            () => notifications.dismiss(id),
                            true,
                        );
                    }}
                </For>
            </box>
        </Layer>
    );
}
