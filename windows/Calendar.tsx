import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

export default function Calendar(
    props: Partial<JSX.IntrinsicElements["window"]>,
) {
    return (
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="calendar"
            visible={false}
            {...props}
        >
            <scrolledwindow
                class="calendar-window info-window"
                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            >
                <box orientation={Gtk.Orientation.VERTICAL} spacing={16}>
                    <Gtk.Calendar hexpand vexpand />
                </box>
            </scrolledwindow>
        </window>
    );
}
