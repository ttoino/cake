import { createBinding, createComputed } from "ags";

import {
    NOTIFICATIONS,
    NOTIFICATIONS_OFF,
    NOTIFICATIONS_UNREAD,
} from "../lib/chars";
import NotificationsProvider from "../providers/notifications";
import { togglePopup } from "../services/windows";
import IconButton from "../widgets/IconButton";

const notifications = NotificationsProvider.get_default();

const count = createBinding(notifications, "storage").as(
    (storage) => storage.length,
);

const icon = createComputed(
    [createBinding(notifications, "dnd"), count],
    (dnd, count) =>
        dnd
            ? NOTIFICATIONS_OFF
            : count > 0
              ? NOTIFICATIONS_UNREAD
              : NOTIFICATIONS,
);
const tooltip = createComputed(
    [createBinding(notifications, "dnd"), count],
    (dnd, count) =>
        dnd
            ? "Do not disturb"
            : count > 0
              ? `${count} notifications`
              : "No notifications",
);

export default function Notifications() {
    return (
        <IconButton
            class="notifications"
            label={icon}
            onClicked={() => togglePopup("notifications")}
            tooltipText={tooltip}
        />
    );
}
