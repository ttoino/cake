import { Astal, Gtk } from "ags/gtk4";

import { entries } from "../lib/objects";
import { dismissPopup } from "../services/popups";
import { currentRoute, isSidebarOpen, ROUTES } from "../services/sidebar";
import Layer, { type LayerProps } from "../widgets/Layer";

const Sidebar = ({ gdkmonitor }: Pick<LayerProps, "gdkmonitor">) => (
    <revealer
        class="sidebar"
        halign={Gtk.Align.END}
        hexpand={false}
        revealChild={isSidebarOpen({ monitor: gdkmonitor })}
        transitionType={Gtk.RevealerTransitionType.SLIDE_LEFT}
    >
        <scrolledwindow>
            <stack visibleChildName={currentRoute.as((c) => c ?? "")}>
                {entries(ROUTES).map(([name, Route]) => (
                    <Route $type="named" name={name} />
                ))}
            </stack>
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
            clickThrough={isSidebarOpen({ monitor: props.gdkmonitor }).as(
                (v) => !v,
            )}
            {...props}
        >
            <box homogeneous={false} orientation={Gtk.Orientation.HORIZONTAL}>
                <box class="corners" halign={Gtk.Align.FILL} hexpand>
                    <Gtk.GestureClick onPressed={() => dismissPopup()} />
                </box>
                <Sidebar gdkmonitor={props.gdkmonitor} />
            </box>
        </Layer>
    );
}
