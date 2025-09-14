import { createBinding, createComputed } from "ags";
import BatteryService from "gi://AstalBattery";

import { BATTERY, SEPARATOR } from "../lib/chars";
import { batteryChargingRange } from "../lib/icons";
import SidebarIconButton, { SidebarIconButtonProps } from "./SidebarIconButton";

const battery = BatteryService.get_default();

const icon = createComputed(
    [createBinding(battery, "charging"), createBinding(battery, "percentage")],
    (charging, percent) => (charging ? batteryChargingRange(percent) : BATTERY),
);
const progress = createBinding(battery, "percentage").as(
    (percent) => percent * 100,
);
const tooltip = createComputed(
    [createBinding(battery, "charging"), createBinding(battery, "percentage")],
    (charging, percent) => {
        const parts = [percent * 100 + "%"];

        if (charging) parts.push("Charging");

        return parts.join(` ${SEPARATOR} `);
    },
);

export default function Battery(props: Omit<SidebarIconButtonProps, "route">) {
    return (
        <SidebarIconButton
            class="battery"
            label={icon}
            progress={progress}
            route="system"
            tooltipText={tooltip}
            {...props}
        />
    );
}
