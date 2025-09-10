import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";

import { CLEAR_ALL, NOTIFICATIONS, NOTIFICATIONS_OFF } from "../lib/chars";
import { ascending } from "../lib/sorting";
import NotificationsProvider from "../providers/notifications";
import IconButton from "../widgets/IconButton";
import Notification from "../widgets/Notification";

const notifications = NotificationsProvider.get_default();

const Notifications = (props: JSX.IntrinsicElements["box"]) => {
    const notificationObjects = createBinding(notifications, "storage").as(
        (n) =>
            n.toSorted((a, b) =>
                ascending(
                    notifications.get(a)?.time ?? 0,
                    notifications.get(b)?.time ?? 0,
                ),
            ),
    );

    return (
        <box
            class="notifications"
            orientation={Gtk.Orientation.VERTICAL}
            spacing={8}
            valign={Gtk.Align.START}
            {...props}
        >
            <box spacing={8}>
                <label
                    halign={Gtk.Align.START}
                    hexpand
                    justify={Gtk.Justification.LEFT}
                    label="Notifications"
                />
                <IconButton
                    label={CLEAR_ALL}
                    onClicked={() => notifications.dismissAll()}
                />
                <togglebutton
                    active={createBinding(notifications, "dnd")}
                    class="icon"
                    label={createBinding(notifications, "dnd").as((dnd) =>
                        dnd ? NOTIFICATIONS_OFF : NOTIFICATIONS,
                    )}
                    onToggled={({ active }) => (notifications.dnd = active)}
                />
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                <For each={notificationObjects}>
                    {(id) => {
                        const notification = notifications.get(id);

                        if (!notification) return <></>;

                        return Notification(notification, () =>
                            notifications.dismiss(id),
                        );
                    }}
                </For>

                <label
                    label="No notifications"
                    visible={notificationObjects.as((v) => v.length === 0)}
                />
            </box>
        </box>
    );
};

export default { notifications: Notifications };
