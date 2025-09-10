import { createBinding, createComputed, For } from "ags";
import Hyprland from "gi://AstalHyprland";

import {
    RADIO_BUTTON_CHECKED,
    RADIO_BUTTON_PARTIAL,
    RADIO_BUTTON_UNCHECKED,
} from "../lib/chars";
import ButtonGroup, { type ButtonGroupProps } from "../widgets/ButtonGroup";
import ToggleIconButton from "../widgets/ToggleIconButton";

const hyprland = Hyprland.get_default();

const WORKSPACE_COUNT = 10;

const workspaces = createBinding(hyprland, "workspaces").as((wss) =>
    Array.from(
        { length: WORKSPACE_COUNT },
        (_, i) =>
            wss.find((ws) => ws.id === i + 1) ??
            Hyprland.Workspace.dummy(i + 1, null),
    ),
);

export default function Workspaces(props: Partial<ButtonGroupProps>) {
    return (
        <ButtonGroup
            class="workspaces"
            size="extra-small"
            type="connected"
            variant="tonal"
            {...props}
        >
            <For each={workspaces}>
                {(ws) => (
                    <ToggleIconButton
                        active={createBinding(hyprland, "focusedWorkspace").as(
                            (fw) => fw.id === ws.id,
                        )}
                        class="workspace"
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
        </ButtonGroup>
    );
}
