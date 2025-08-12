import { Astal, Gtk } from "ags/gtk4";

import ActiveWindow from "../bar/ActiveWindow";
import Audio from "../bar/Audio";
import Battery from "../bar/Battery";
import Bluetooth from "../bar/Bluetooth";
import Brightness from "../bar/Brightness";
import Clock from "../bar/Clock";
import Media from "../bar/Media";
import Network from "../bar/Network";
import Notifications from "../bar/Notifications";
import Workspaces from "../bar/Workspaces";
import { accessor } from "../lib/state";

export default function Bar(
    props: Partial<Omit<JSX.IntrinsicElements["window"], "gdkmonitor">> &
        Required<Pick<JSX.IntrinsicElements["window"], "gdkmonitor">>,
) {
    return (
        <window
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT
            }
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            marginBottom={16}
            marginLeft={16}
            marginRight={16}
            marginTop={0}
            name={accessor(props.gdkmonitor).as(
                (monitor) => `bar-${monitor.model}`,
            )}
            {...props}
        >
            <centerbox class="bar">
                <box $type="start" halign={Gtk.Align.START}>
                    <Workspaces />
                </box>
                <box $type="center">
                    <ActiveWindow />
                </box>
                <box $type="end" halign={Gtk.Align.END} spacing={4}>
                    <Media />
                    <Audio />
                    <Brightness />
                    <Bluetooth />
                    <Network />
                    <Battery />
                    <Notifications />
                    <Clock />
                </box>
            </centerbox>
        </window>
    );
}
