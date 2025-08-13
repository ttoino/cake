import { Gtk } from "ags/gtk4";

import { CLOSE } from "../lib/chars";
import { urgencyToString } from "../lib/notifications";
import { relativeTime } from "../lib/time";
import date from "../providers/date";
import { Notification as NotificationObject } from "../providers/notifications";
import IconButton from "./IconButton";
import IconSlider from "./IconSlider";
import ScrollText from "./ScrollText";

const NotificationHeader = (
    notification: NotificationObject,
    onDismiss: () => void,
    popup: boolean,
) =>
    !notification.hideHeader && (
        <box class="notification-app" hexpand spacing={4} vexpand>
            {notification.appIcon && <image iconName={notification.appIcon} />}
            {notification.appName && (
                <label
                    halign={Gtk.Align.START}
                    hexpand
                    label={notification.appName}
                    lines={1}
                    wrap={false}
                />
            )}
            {!popup && (
                <>
                    <label
                        halign={Gtk.Align.END}
                        hexpand
                        label={date.as((date) =>
                            relativeTime(
                                new Date(notification.time * 1000),
                                date.date,
                            ),
                        )}
                        lines={1}
                        tooltipText={new Date(notification.time).toString()}
                        wrap={false}
                    />
                    <IconButton
                        class="sm"
                        label={CLOSE}
                        onClicked={onDismiss}
                        tooltipText="Dismiss"
                    />
                </>
            )}
        </box>
    );

const NotificationBody = (notification: NotificationObject) =>
    !notification.hideBody && (
        <box class="notification-body" hexpand spacing={8} vexpand>
            {notification.image && (
                <box
                    class="notification-image"
                    css={`
                        background-image: url("${notification.image}");
                    `}
                    valign={Gtk.Align.START}
                />
            )}
            <box
                hexpand
                orientation={Gtk.Orientation.VERTICAL}
                spacing={8}
                vexpand
            >
                {notification.summary && (
                    <ScrollText
                        label={notification.summary}
                        labelProps={{ halign: Gtk.Align.START }}
                    />
                )}
                {notification.body && (
                    <label
                        halign={Gtk.Align.START}
                        hexpand
                        label={notification.body}
                        lines={4}
                        wrap
                    />
                )}
            </box>
        </box>
    );

const NotificationSlider = (notification: NotificationObject) => {
    const value = notification.sliderValue;
    if (value == undefined) return;

    const icon = notification.sliderIcon;

    return icon && icon.length > 0 ? (
        <IconSlider
            drawValue={false}
            hexpand
            icon={icon}
            max={100}
            min={0}
            sensitive={false}
            value={value}
        />
    ) : (
        <slider
            drawValue={false}
            hexpand
            max={100}
            min={0}
            sensitive={false}
            value={value}
        />
    );
};

const NotificationActions = (notification: NotificationObject) => {
    return (
        notification.actions?.length > 0 && (
            <box class="notification-actions" spacing={8}>
                {notification.actions.map((action) => (
                    <button
                        label={action.label}
                        // onClicked={() => notification.invoke(action.id)}
                    />
                ))}
            </box>
        )
    );
};

export default function Notification(
    notification: NotificationObject,
    onDismiss: () => void,
    popup = false,
) {
    return (
        <box
            class={`${notification.className} ${urgencyToString[notification.urgency]} notification`}
            hexpand
            orientation={Gtk.Orientation.VERTICAL}
            spacing={8}
            valign={Gtk.Align.START}
        >
            {NotificationHeader(notification, onDismiss, popup)}
            {NotificationBody(notification)}
            {NotificationSlider(notification)}
            {NotificationActions(notification)}
        </box>
    );
}
