import { createBinding, createComputed } from "ags";
import Wp from "gi://AstalWp";

import { SEPARATOR, VOLUME_MUTE } from "../lib/chars";
import { volumeRange } from "../lib/icons";
import { togglePopup } from "../services/windows";
import IconButton from "../widgets/IconButton";

const audio = Wp.get_default();

const icon =
    audio &&
    createComputed(
        [
            createBinding(audio.default_speaker, "mute"),
            createBinding(audio.defaultSpeaker, "volume"),
        ],
        (mute, volume) => (mute ? VOLUME_MUTE : volumeRange(volume)),
    );
const tooltip =
    audio &&
    createComputed(
        [
            createBinding(audio.default_speaker, "description"),
            createBinding(audio.default_speaker, "mute"),
            createBinding(audio.defaultSpeaker, "volume"),
        ],
        (description, mute, volume) => {
            const parts = [description, Math.round(volume * 100) + "%"];

            if (mute) parts.push("Muted");

            return parts.join(` ${SEPARATOR} `);
        },
    );

export default function Audio() {
    if (!audio || !icon || !tooltip) return <></>;

    return (
        <IconButton
            class="audio"
            label={icon}
            onClicked={() => togglePopup("audio")}
            tooltipText={tooltip}
        />
    );
}
