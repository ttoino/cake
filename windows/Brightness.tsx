import { createBinding } from "ags";
import { Astal } from "ags/gtk4";
import app from "ags/gtk4/app";

import { brightnessRange } from "../lib/icons";
import BrightnessService from "../providers/brightness";
import IconSlider from "../widgets/IconSlider";

const brightness = BrightnessService.get_default();

export default function Brightness(
    props: Partial<JSX.IntrinsicElements["window"]>,
) {
    return (
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="brightness"
            visible={false}
            {...props}
        >
            <box class="slider-window">
                <IconSlider
                    drawValue={false}
                    hexpand
                    icon={createBinding(brightness, "percentage").as(
                        brightnessRange,
                    )}
                    onNotifyValue={({ value }) =>
                        (brightness.percentage = value)
                    }
                    step={10}
                    value={createBinding(brightness, "percentage")}
                />
            </box>
        </window>
    );
}
