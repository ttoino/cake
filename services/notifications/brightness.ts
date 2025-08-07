import app from "ags/gtk4/app";

import { brightnessRange } from "../../lib/icons";
import { notify } from "../../lib/notifications";
import Brightness from "../../providers/brightness";

const brightness = Brightness.get_default();

let brightnessId: string | undefined;
brightness.connect("notify::percentage", async () => {
    if (app.get_window("brightness")?.visible) return;

    const out = await notify({
        className: "brightness round",
        hideBody: true,
        hideHeader: true,
        id: brightnessId,
        slider: {
            icon: brightnessRange(brightness.percentage),
            value: brightness.percentage * 100,
        },
        title: "Brightness",
        transient: true,
    });

    if (!brightnessId) brightnessId = out.trim();
});

export {};
