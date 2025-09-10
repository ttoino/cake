import { Astal, Gtk } from "ags/gtk4";

import { dismissPopup } from "../services/popups";
import Layer, { type LayerProps } from "../widgets/Layer";

const Sidebar = () => (
    <revealer>
        <scrolledwindow>
            <stack></stack>
        </scrolledwindow>
    </revealer>
);

export default function Main(props: LayerProps) {
    return (
        <Layer
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            clickThrough
            {...props}
        >
            <box orientation={Gtk.Orientation.HORIZONTAL}>
                <box class="corners" hexpand>
                    <Gtk.GestureClick onPressed={() => dismissPopup()} />
                </box>
                <Sidebar />
            </box>
        </Layer>
    );
}
