import { createBinding, createComputed } from "ags";
import BatteryService from "gi://AstalBattery";

import { SEPARATOR } from "../lib/chars";
import { batteryRange } from "../lib/icons";
import SidebarIconButton, { SidebarIconButtonProps } from "./SidebarIconButton";

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

export default function Battery(props: Omit<SidebarIconButtonProps, "route">) {
    return (
        <SidebarIconButton
            class="battery"
            css={`
                --battery: ${battery.percentage * 100};
            `}
            label={icon}
            route="system"
            tooltipText={tooltip}
            {...props}
        />
    );
}
