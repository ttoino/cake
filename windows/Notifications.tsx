import { createBinding, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

import { BELL, BELL_OFF, NOTIFICATION_CLEAR } from "../lib/chars";
import { ascending } from "../lib/sorting";
import NotificationsProvider from "../providers/notifications";
import IconButton from "../widgets/IconButton";
import Notification from "../widgets/Notification";

const notifications = NotificationsProvider.get_default();

export default function Notifications(
    props: Partial<JSX.IntrinsicElements["window"]>,
) {
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
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="notifications"
            {...props}
        >
            <scrolledwindow
                class="notifications-window info-window"
                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            >
                <box
                    orientation={Gtk.Orientation.VERTICAL}
                    spacing={8}
                    valign={Gtk.Align.START}
                >
                    <box spacing={8}>
                        <label
                            halign={Gtk.Align.START}
                            hexpand
                            justify={Gtk.Justification.LEFT}
                            label="Notifications"
                        />
                        <IconButton
                            label={NOTIFICATION_CLEAR}
                            onClicked={() => notifications.dismissAll()}
                        />
                        <togglebutton
                            active={createBinding(notifications, "dnd")}
                            class="icon"
                            label={createBinding(notifications, "dnd").as(
                                (dnd) => (dnd ? BELL_OFF : BELL),
                            )}
                            onToggled={({ active }) =>
                                (notifications.dnd = active)
                            }
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
                            visible={notificationObjects.as(
                                (v) => v.length === 0,
                            )}
                        />
                    </box>
                </box>
            </scrolledwindow>
        </window>
    );
}
