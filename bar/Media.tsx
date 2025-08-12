import { createBinding, createComputed } from "ags";
import Mpris from "gi://AstalMpris";

import { MUSIC_NOTE, SEPARATOR } from "../lib/chars";
import { createArrayBinding } from "../lib/state";
import { togglePopup } from "../services/windows";
import IconButton from "../widgets/IconButton";

const media = Mpris.get_default();

export default function Media() {
    return (
        <IconButton
            class="media"
            onClicked={() => togglePopup("media")}
            tooltipText={createArrayBinding(media, "players", (player) =>
                createComputed(
                    [
                        createBinding(player, "title"),
                        createBinding(player, "artist"),
                        createBinding(player, "albumArtist"),
                    ],
                    (title, artist, albumArtist) =>
                        `${title} ${SEPARATOR} ${artist || albumArtist}`,
                ),
            ).as((players) => players.join("\n"))}
            visible={createBinding(media, "players").as((p) => p.length > 0)}
        >
            {MUSIC_NOTE}
        </IconButton>
    );
}
