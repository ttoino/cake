import { Astal, Gdk, Gtk } from "ags/gtk4";

import {
    LOCK,
    MODE_COOL,
    MODE_OFF_ON,
    MODE_STANDBY,
    RESTART_ALT,
} from "../lib/chars";
import PowerService from "../providers/power";
import { dismissPopup } from "../services/popups";
import ButtonGroup from "../widgets/ButtonGroup";
import IconButton from "../widgets/IconButton";
import Layer, { LayerProps } from "../widgets/Layer";

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
        icon: MODE_OFF_ON,
        keybind: Gdk.KEY_s,
        name: "shutdown",
    },
    {
        action: power.restart,
        icon: RESTART_ALT,
        keybind: Gdk.KEY_r,
        name: "restart",
    },
    {
        action: power.sleep,
        icon: MODE_STANDBY,
        keybind: Gdk.KEY_z,
        name: "sleep",
    },
    {
        action: power.hibernate,
        icon: MODE_COOL,
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
            onClicked={() => {
                dismissPopup();
                action();
            }}
        >
            {icon}
        </IconButton>
    </box>
);

export default function Power(props: LayerProps) {
    return (
        <Layer
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            layer={Astal.Layer.OVERLAY}
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
                <ButtonGroup
                    class="power-controls"
                    size="large"
                    variant="tonal"
                >
                    {actions.map(ActionButton)}
                </ButtonGroup>
            </box>
        </Layer>
    );
}
