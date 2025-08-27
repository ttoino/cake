import { createBinding, createComputed, For } from "ags";
import Hyprland from "gi://AstalHyprland";

import {
    RADIO_BUTTON_CHECKED,
    RADIO_BUTTON_PARTIAL,
    RADIO_BUTTON_UNCHECKED,
} from "../lib/chars";
import IconButton from "../widgets/IconButton";

const hyprland = Hyprland.get_default();

const WORKSPACE_COUNT = 10;

const workspaces = createComputed(
    [
        createBinding(hyprland, "workspaces"),
        createBinding(hyprland, "focusedMonitor"),
    ],
    (wss, monitor) =>
        Array.from(
            { length: WORKSPACE_COUNT },
            (_, i) =>
                wss.find((ws) => ws.id === i + 1) ??
                Hyprland.Workspace.dummy(i + 1, monitor),
        ),
);

export default function Workspaces() {
    return (
        <box class="workspaces" spacing={4}>
            <For each={workspaces}>
                {(ws) => (
                    <IconButton
                        label={createComputed(
                            [
                                createBinding(hyprland, "focusedWorkspace"),
                                createBinding(ws, "clients"),
                            ],
                            (fw, clients) =>
                                fw.id === ws.id
                                    ? RADIO_BUTTON_CHECKED
                                    : clients.length > 0
                                      ? RADIO_BUTTON_PARTIAL
                                      : RADIO_BUTTON_UNCHECKED,
                        )}
                        onClicked={() =>
                            hyprland.dispatch("workspace", ws.id.toString())
                        }
                    />
                )}
            </For>
        </box>
    );
}
