import { createBinding, createComputed } from "ags";
import Wp from "gi://AstalWp";

import { NO_SOUND, SEPARATOR, VOLUME } from "../lib/chars";
import SidebarIconButton, { SidebarIconButtonProps } from "./SidebarIconButton";

const audio = Wp.get_default();

const icon =
    audio &&
    createBinding(audio.defaultSpeaker, "mute").as((mute) =>
        mute ? NO_SOUND : VOLUME,
    );
const progres =
    audio &&
    createBinding(audio.defaultSpeaker, "volume").as((volume) => volume * 100);
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
            progress={progres}
            route="audio"
            tooltipText={tooltip}
            {...props}
        />
    );
}
