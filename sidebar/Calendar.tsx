import { Gtk } from "ags/gtk4";

const Calendar = (props: JSX.IntrinsicElements["box"]) => (
    <box
        class="calendar"
        orientation={Gtk.Orientation.VERTICAL}
        spacing={16}
        {...props}
    >
        <Gtk.Calendar hexpand vexpand />
    </box>
);

export default { calendar: Calendar };
