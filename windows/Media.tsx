import { createBinding, createComputed, createState, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Mpris from "gi://AstalMpris";

import { PAUSE, PLAY, SKIP_NEXT, SKIP_PREVIOUS } from "../lib/chars";
import { ascending } from "../lib/sorting";
import IconButton from "../widgets/IconButton";
import ScrollText from "../widgets/ScrollText";

const mpris = Mpris.get_default();

const Player = (player: Mpris.Player, onChoose: () => void) => (
    // Can't bind to busName because the widget name should not change
    <box
        $type="named"
        name={player.busName}
        orientation={Gtk.Orientation.VERTICAL}
        spacing={8}
    >
        <button onClicked={onChoose}>
            <ScrollText
                label={createComputed(
                    [
                        createBinding(player, "identity"),
                        createBinding(player, "busName"),
                    ],
                    (identity, busName) => identity ?? busName,
                )}
            />
        </button>
        <box
            class="cover"
            css={createBinding(player, "coverArt").as(
                (image) => `background-image: url("${image}")`,
            )}
            visible={createBinding(player, "coverArt").as((image) => !!image)}
        />
        <box orientation={Gtk.Orientation.VERTICAL}>
            <ScrollText class="title" label={createBinding(player, "title")} />
            <ScrollText
                class="artist"
                label={createBinding(player, "artist").as((a) => a ?? "")}
                visible={createBinding(player, "artist").as((a) => !!a)}
            />
        </box>
        <box halign={Gtk.Align.CENTER} spacing={16}>
            <IconButton
                class="lg"
                label={SKIP_PREVIOUS}
                onClicked={() => player.previous()}
                valign={Gtk.Align.CENTER}
            />
            <IconButton
                class="xl"
                label={createBinding(player, "playbackStatus").as((status) =>
                    status === Mpris.PlaybackStatus.PLAYING ? PAUSE : PLAY,
                )}
                onClicked={() => player.play_pause()}
            />
            <IconButton
                class="lg"
                label={SKIP_NEXT}
                onClicked={() => player.next()}
                valign={Gtk.Align.CENTER}
            />
        </box>
        <slider
            max={createBinding(player, "length")}
            onNotifyValue={({ value }) => player.set_position(value)}
            value={createBinding(player, "position")}
            visible={createBinding(player, "length").as((v) => v > 0)}
        />
    </box>
);

export default function Media(props: Partial<JSX.IntrinsicElements["window"]>) {
    const [visible, setVisible] = createState("_choose");

    const players = createBinding(mpris, "players").as((players) =>
        players.toSorted(
            (a, b) =>
                ascending(a.identity, b.identity) ||
                ascending(a.busName, b.busName),
        ),
    );

    return (
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="media"
            {...props}
        >
            <stack
                class="media-window info-window"
                transitionType={Gtk.StackTransitionType.CROSSFADE}
                visibleChildName={visible}
            >
                <box
                    $type="named"
                    name="_choose"
                    orientation={Gtk.Orientation.VERTICAL}
                    spacing={8}
                >
                    <label label="Choose a player" />
                    <For each={players}>
                        {(player) => (
                            <button
                                label={createBinding(player, "identity")}
                                onClicked={() => setVisible(player.busName)}
                            />
                        )}
                    </For>
                </box>

                <For each={players}>
                    {(player) => Player(player, () => setVisible("_choose"))}
                </For>
            </stack>
        </window>
    );
}
