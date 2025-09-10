import { createBinding } from "ags";

import { brightnessRange } from "../lib/icons";
import BrightnessService from "../providers/brightness";
import SidebarIconButton, { SidebarIconButtonProps } from "./SidebarIconButton";

const brightness = BrightnessService.get_default();

const label = createBinding(brightness, "percentage").as((p) =>
    brightnessRange(p),
);

const tooltip = createBinding(brightness, "percentage").as(
    (p) => `${Math.round(p * 100)}%`,
);

export default function Brightness(
    props: Omit<SidebarIconButtonProps, "route">,
) {
    return (
        <SidebarIconButton
            class="brightness"
            label={label}
            route="brightness"
            tooltipText={tooltip}
            {...props}
        />
    );
}
