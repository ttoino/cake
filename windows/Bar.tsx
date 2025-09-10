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
import ButtonGroup from "../widgets/ButtonGroup";
import Layer, { type LayerProps } from "../widgets/Layer";

export default function Bar(props: LayerProps) {
    return (
        <Layer
            anchor={
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            canFocus={false}
            exclusivity={Astal.Exclusivity.EXCLUSIVE}
            {...props}
        >
            <centerbox>
                <Workspaces $type="start" halign={Gtk.Align.START} />
                <box $type="center">
                    <ActiveWindow />
                </box>
                <ButtonGroup
                    $type="end"
                    halign={Gtk.Align.END}
                    size="extra-small"
                    type="connected"
                    variant="tonal"
                >
                    <Media />
                    <Audio />
                    <Brightness />
                    <Bluetooth />
                    <Network />
                    <Battery />
                    <Notifications />
                    <Clock />
                </ButtonGroup>
            </centerbox>
        </Layer>
    );
}
