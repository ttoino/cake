import { createBinding, createComputed } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import BatteryService from "gi://AstalBattery";
import PowerProfiles from "gi://AstalPowerProfiles";

import { batteryRange } from "../lib/icons";
import ExpandableWindow from "../widgets/ExpandableWindow";
import IconSlider from "../widgets/IconSlider";

const battery = BatteryService.get_default();
const powerProfiles = PowerProfiles.get_default();

const icon = createComputed(
    [createBinding(battery, "charging"), createBinding(battery, "percentage")],
    (charging, percent) => batteryRange(charging, percent),
);

const BatterySlider = () => (
    <IconSlider
        drawValue={false}
        hexpand
        icon={icon}
        sensitive={false}
        value={createBinding(battery, "percentage")}
    />
);

export default function Battery(
    props: Partial<JSX.IntrinsicElements["window"]>,
) {
    return (
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="battery"
            {...props}
        >
            <ExpandableWindow
                collapsed={<BatterySlider />}
                expanded={({ collapseButton, ...props }) => (
                    <scrolledwindow
                        hscrollbarPolicy={Gtk.PolicyType.NEVER}
                        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                        {...props}
                    >
                        <box
                            orientation={Gtk.Orientation.VERTICAL}
                            spacing={16}
                        >
                            <box spacing={16}>
                                {collapseButton}
                                <label
                                    halign={Gtk.Align.START}
                                    hexpand
                                    justify={Gtk.Justification.LEFT}
                                    label="Battery"
                                />
                            </box>
                            <box hexpand homogeneous>
                                {powerProfiles.get_profiles().map((profile) => (
                                    <togglebutton
                                        active={createBinding(
                                            powerProfiles,
                                            "activeProfile",
                                        ).as((p) => p === profile.profile)}
                                        class="toggle filled"
                                        onToggled={({ active }) =>
                                            active &&
                                            powerProfiles.set_active_profile(
                                                profile.profile,
                                            )
                                        }
                                    >
                                        {profile.profile}
                                    </togglebutton>
                                ))}
                            </box>
                            <box vexpand />
                            <BatterySlider />
                        </box>
                    </scrolledwindow>
                )}
            />
        </window>
    );
}
