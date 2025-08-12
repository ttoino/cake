import { createBinding, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";

import { ascending } from "../lib/sorting";
import { accessor } from "../lib/state";
import Notifications from "../providers/notifications";
import Notification from "../widgets/Notification";

const notifications = Notifications.get_default();

export default function Popups(
    props: Partial<Omit<JSX.IntrinsicElements["window"], "gdkmonitor">> &
        Required<Pick<JSX.IntrinsicElements["window"], "gdkmonitor">>,
) {
    const popups = createBinding(notifications, "popups").as((ids) =>
        ids.toSorted((a, b) =>
            ascending(
                notifications.get(a)?.time ?? 0,
                notifications.get(b)?.time ?? 0,
            ),
        ),
    );

    return (
        <window
            anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT}
            class={"popups"}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            margin={16}
            name={accessor(props.gdkmonitor).as(
                (monitor) =>
                    `popups-${monitor.model.replace(/\s/g, "-").toLowerCase()}`,
            )}
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
        </window>
    );
}
