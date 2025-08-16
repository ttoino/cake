import { Astal } from "ags/gtk4";
import app from "ags/gtk4/app";

import { accessor } from "../lib/state";

export default function Scrim(
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
            class="scrim-window"
            exclusivity={Astal.Exclusivity.IGNORE}
            layer={Astal.Layer.OVERLAY}
            name={accessor(props.gdkmonitor).as(
                (monitor) => `scrim-${monitor.model}`,
            )}
            namespace="cake-scrim"
            {...props}
        />
    );
}
