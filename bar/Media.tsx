import { createBinding, createComputed } from "ags";
import Mpris from "gi://AstalMpris";

import { MUSIC_NOTE, SEPARATOR } from "../lib/chars";
import { createArrayBinding } from "../lib/state";
import SidebarIconButton, { SidebarIconButtonProps } from "./SidebarIconButton";

const media = Mpris.get_default();

const tooltip = createArrayBinding(media, "players", (player) =>
    createComputed(
        [
            createBinding(player, "title"),
            createBinding(player, "artist"),
            createBinding(player, "albumArtist"),
        ],
        (title, artist, albumArtist) =>
            `${title} ${SEPARATOR} ${artist || albumArtist}`,
    ),
).as((players) => players.join("\n"));

const visible = createBinding(media, "players").as((p) => p.length > 0);

export default function Media(props: Omit<SidebarIconButtonProps, "route">) {
    return (
        <SidebarIconButton
            class="media"
            label={MUSIC_NOTE}
            route="media"
            tooltipText={tooltip}
            visible={visible}
            {...props}
        />
    );
}
