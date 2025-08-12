import { Accessor, createComputed } from "ags";
import { Gtk } from "ags/gtk4";

import { accessor } from "../lib/state";
import Icon from "./Icon";

export interface DeviceProps {
    activating?: Accessor<boolean | undefined> | boolean;
    active?: Accessor<boolean | undefined> | boolean;
    icon?: Accessor<string | undefined> | string;
    iconTooltip?: Accessor<string | undefined> | string;
    onPrimaryClick?(): void;
    onSecondaryClick?(): void;

    subtitle?: Accessor<string | undefined> | string;
    title?: Accessor<string | undefined> | string;
}

export default function Device({
    activating,
    active,
    icon,
    iconTooltip,
    onPrimaryClick = () => {},
    onSecondaryClick = () => {},
    subtitle,
    title,
}: DeviceProps) {
    const titleB = accessor(title);
    const subtitleB = accessor(subtitle);
    const iconB = accessor(icon);
    const iconTooltipB = accessor(iconTooltip);
    const activeB = accessor(active);
    const activatingB = accessor(activating);

    const className = createComputed(
        [activeB, activatingB],
        (active, activating) =>
            `device ${active ? "active" : ""} ${activating ? "activating" : ""}`,
    );

    return (
        <box class={className} spacing={16}>
            <Gtk.GestureClick button={1} onPressed={onPrimaryClick} />
            <Gtk.GestureClick button={3} onPressed={onSecondaryClick} />

            <Icon
                label={iconB.as((icon) => icon ?? "")}
                tooltipText={iconTooltipB.as((tooltip) => tooltip ?? "")}
                visible={iconB.as((icon) => !!icon)}
            />
            <box
                orientation={Gtk.Orientation.VERTICAL}
                valign={Gtk.Align.CENTER}
            >
                <label
                    halign={Gtk.Align.START}
                    hexpand
                    label={titleB.as((title) => title ?? "")}
                    lines={1}
                    visible={titleB.as((title) => !!title)}
                    wrap={false}
                />
                <label
                    class="secondary"
                    halign={Gtk.Align.START}
                    hexpand
                    label={subtitleB.as((subtitle) => subtitle ?? "")}
                    lines={1}
                    visible={subtitleB.as((subtitle) => !!subtitle)}
                    wrap={false}
                />
            </box>
        </box>
    );
}
