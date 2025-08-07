import { Astal, Gdk, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

import { accessor } from "../lib/vars";
import { dismissPopup } from "../services/windows";

export default function Dismisser(
    props: Partial<Omit<JSX.IntrinsicElements["window"], "gdkmonitor">> &
        Required<Pick<JSX.IntrinsicElements["window"], "gdkmonitor">>,
) {
    return (
        <window
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            application={app}
            class="dismisser-window"
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            layer={Astal.Layer.TOP}
            name={accessor(props.gdkmonitor).as(
                (monitor) => `dismisser-${monitor.model}`,
            )}
            namespace="ags-dismisser"
            {...props}
        >
            <Gtk.GestureClick onPressed={() => dismissPopup()} />
            <Gtk.EventControllerKey
                onKeyPressed={(self, keyval) => {
                    if (keyval === Gdk.KEY_Escape) dismissPopup();
                }}
            />
        </window>
    );
}
