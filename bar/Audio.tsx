import { createBinding, createComputed } from "ags";
import Wp from "gi://AstalWp";

import { NO_SOUND, SEPARATOR } from "../lib/chars";
import { volumeRange } from "../lib/icons";
import SidebarIconButton, { SidebarIconButtonProps } from "./SidebarIconButton";

const audio = Wp.get_default();

const icon =
    audio &&
    createComputed(
        [
            createBinding(audio.defaultSpeaker, "mute"),
            createBinding(audio.defaultSpeaker, "volume"),
        ],
        (mute, volume) => (mute ? NO_SOUND : volumeRange(volume)),
    );
const tooltip =
    audio &&
    createComputed(
        [
            createBinding(audio.defaultSpeaker, "description"),
            createBinding(audio.defaultSpeaker, "mute"),
            createBinding(audio.defaultSpeaker, "volume"),
        ],
        (description, mute, volume) => {
            const parts = [description, Math.round(volume * 100) + "%"];

            if (mute) parts.push("Muted");

            return parts.join(` ${SEPARATOR} `);
        },
    );

export default function Audio(props: Omit<SidebarIconButtonProps, "route">) {
    if (!audio || !icon || !tooltip) return <></>;

    return (
        <SidebarIconButton
            class="audio"
            label={icon}
            route="audio"
            tooltipText={tooltip}
            {...props}
        />
    );
}
