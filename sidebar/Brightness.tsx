import { createBinding } from "ags";

import { brightnessRange } from "../lib/icons";
import BrightnessService from "../providers/brightness";
import IconSlider from "../widgets/IconSlider";

const brightness = BrightnessService.get_default();

const Brightness = (props: JSX.IntrinsicElements["box"]) => (
    <box class="brightness" {...props}>
        <IconSlider
            drawValue={false}
            hexpand
            icon={createBinding(brightness, "percentage").as(brightnessRange)}
            onNotifyValue={({ value }) => (brightness.percentage = value)}
            step={10}
            value={createBinding(brightness, "percentage")}
        />
    </box>
);

export default { brightness: Brightness };
