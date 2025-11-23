import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import BatteryService from "gi://AstalBattery";
import PowerProfiles from "gi://AstalPowerProfiles";

import { BATTERY, BATTERY_CHARGING } from "../lib/chars";
import ButtonGroup from "../widgets/ButtonGroup";
import IconSlider from "../widgets/IconSlider";
import ToggleButton from "../widgets/ToggleButton";

const battery = BatteryService.get_default();
const powerProfiles = PowerProfiles.get_default();

const icon = createBinding(battery, "charging").as((charging) =>
    charging ? BATTERY_CHARGING : BATTERY,
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

const Battery = (props: JSX.IntrinsicElements["box"]) => (
    <box orientation={Gtk.Orientation.VERTICAL} spacing={16} {...props}>
        <box spacing={16}>
            <label
                halign={Gtk.Align.START}
                hexpand
                justify={Gtk.Justification.LEFT}
                label="Battery"
            />
        </box>
        <ButtonGroup hexpand homogeneous type="connected" variant="filled">
            {powerProfiles.get_profiles().map((profile) => (
                <ToggleButton
                    active={createBinding(powerProfiles, "activeProfile").as(
                        (p) => p === profile.profile,
                    )}
                    onToggled={({ active }) =>
                        active &&
                        powerProfiles.set_active_profile(profile.profile)
                    }
                >
                    {profile.profile}
                </ToggleButton>
            ))}
        </ButtonGroup>
        <BatterySlider />
    </box>
);

export default {
    system: Battery,
};
