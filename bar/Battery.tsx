import { createBinding, createComputed } from "ags";
import BatteryService from "gi://AstalBattery";

import { SEPARATOR } from "../lib/chars";
import { batteryRange } from "../lib/icons";
import { togglePopup } from "../services/windows";
import IconButton from "../widgets/IconButton";

const battery = BatteryService.get_default();

const icon = createComputed(
    [createBinding(battery, "charging"), createBinding(battery, "percentage")],
    (charging, percent) => batteryRange(charging, percent),
);
const tooltip = createComputed(
    [createBinding(battery, "charging"), createBinding(battery, "percentage")],
    (charging, percent) => {
        const parts = [percent * 100 + "%"];

        if (charging) parts.push("Charging");

        return parts.join(` ${SEPARATOR} `);
    },
);

export default function Battery() {
    return (
        <IconButton
            class="battery"
            label={icon}
            onClicked={() => togglePopup("battery")}
            tooltipText={tooltip}
        />
    );
}
