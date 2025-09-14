import app from "ags/gtk4/app";
import Wp from "gi://AstalWp";

import { VOLUME } from "../../lib/chars";
import { notify } from "../../lib/notifications";

const audio = Wp.get_default();

let speakerId: string | undefined;
audio?.defaultSpeaker.connect(
    "notify::volume",
    async (speaker: Wp.Endpoint) => {
        if (app.get_window("audio")?.visible) return;

        const out = await notify({
            className: "audio round",
            hideBody: true,
            hideHeader: true,
            id: speakerId,
            slider: {
                icon: VOLUME,
                value: speaker.volume * 100,
            },
            title: "Volume",
            transient: true,
        });

        if (!speakerId) speakerId = out.trim();
    },
);

export {};
