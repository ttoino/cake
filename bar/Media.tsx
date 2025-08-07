import { createBinding } from "ags";
import Mpris from "gi://AstalMpris";

import { MUSIC_NOTE, SEPARATOR } from "../lib/chars";
import { togglePopup } from "../services/windows";
import IconButton from "../widgets/IconButton";

const media = Mpris.get_default();

export default function Media() {
    return (
        <IconButton
            class="media"
            onClicked={() => togglePopup("media")}
            tooltipText={createBinding(media, "players").as((players) =>
                players
                    .map(
                        (player) =>
                            `${player.title} ${SEPARATOR} ${
                                player.artist || player.albumArtist
                            }`,
                    )
                    .join("\n"),
            )}
            visible={createBinding(media, "players").as((p) => p.length > 0)}
        >
            {MUSIC_NOTE}
        </IconButton>
    );
}
