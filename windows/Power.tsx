import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

import { LOCK, POWER, POWER_SLEEP, RESTART, SNOWFLAKE } from "../lib/chars";
import PowerService from "../providers/power";
import { dismissPopup } from "../services/windows";
import IconButton from "../widgets/IconButton";

const power = PowerService.get_default();

interface Action {
    action: () => void;
    icon: string;
    keybind: number;
    name: string;
}

const actions = [
    {
        action: power.shutdown,
        icon: POWER,
        keybind: Gdk.KEY_s,
        name: "shutdown",
    },
    {
        action: power.restart,
        icon: RESTART,
        keybind: Gdk.KEY_r,
        name: "restart",
    },
    {
        action: power.sleep,
        icon: POWER_SLEEP,
        keybind: Gdk.KEY_z,
        name: "sleep",
    },
    {
        action: power.hibernate,
        icon: SNOWFLAKE,
        keybind: Gdk.KEY_h,
        name: "hibernate",
    },
    {
        action: power.lock,
        icon: LOCK,
        keybind: Gdk.KEY_l,
        name: "lock",
    },
] as const satisfies Action[];

const ActionButton = ({ action, icon, name }: Action) => (
    <box class={name}>
        <IconButton
            class="xl"
            onClicked={() => {
                dismissPopup();
                action();
            }}
        >
            {icon}
        </IconButton>
    </box>
);

export default function Power(props: Partial<JSX.IntrinsicElements["window"]>) {
    return (
        <window
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            application={app}
            class="power-window"
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            layer={Astal.Layer.OVERLAY}
            name="power"
            {...props}
        >
            <Gtk.EventControllerKey
                onKeyPressed={(self, key) => {
                    const action = actions.find((a) => a.keybind == key);
                    if (action) {
                        dismissPopup();
                        action?.action();
                    }
                }}
            />

            <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                <box class="power-controls" spacing={16}>
                    {actions.map(ActionButton)}
                </box>
            </box>
        </window>
    );
}
