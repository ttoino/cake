import { createBinding } from "ags";

import { brightnessRange } from "../lib/icons";
import BrightnessService from "../providers/brightness";
import { togglePopup } from "../services/windows";
import IconButton from "../widgets/IconButton";

const brightness = BrightnessService.get_default();

export default function Brightness() {
    return (
        <IconButton
            class="brightness"
            label={createBinding(brightness, "percentage").as((p) =>
                brightnessRange(p),
            )}
            onClicked={() => togglePopup("brightness")}
            tooltipText={createBinding(brightness, "percentage").as(
                (p) => `${Math.round(p * 100)}%`,
            )}
        />
    );
}
