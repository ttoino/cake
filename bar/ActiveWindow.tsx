import { createBinding, With } from "ags";
import Hyprland from "gi://AstalHyprland";
import Pango from "gi://Pango?version=1.0";

import {
    ALPHA_X_CIRCLE,
    FULLSCREEN,
    FULLSCREEN_EXIT,
    PIN,
    WINDOW_RESTORE,
} from "../lib/chars";
import Icon from "../widgets/Icon";

const hyprland = Hyprland.get_default();

export default function ActiveWindow() {
    const client = createBinding(hyprland, "focusedClient");

    return (
        <box class="active-window" spacing={8}>
            <With value={client}>
                {(client) => (
                    <label
                        ellipsize={Pango.EllipsizeMode.END}
                        label={client && createBinding(client, "title")}
                        visible={!!client}
                    />
                )}
            </With>

            <With value={client}>
                {(client) => (
                    <Icon
                        label={WINDOW_RESTORE}
                        visible={client && createBinding(client, "floating")}
                    />
                )}
            </With>

            <With value={client}>
                {(client) => (
                    <Icon
                        label={FULLSCREEN_EXIT}
                        visible={
                            client &&
                            createBinding(client, "fullscreen").as(
                                (it) => !!(it & Hyprland.Fullscreen.MAXIMIZED),
                            )
                        }
                    />
                )}
            </With>

            <With value={client}>
                {(client) => (
                    <Icon
                        label={FULLSCREEN}
                        visible={
                            client &&
                            createBinding(client, "fullscreen").as(
                                (it) => !!(it & Hyprland.Fullscreen.FULLSCREEN),
                            )
                        }
                    />
                )}
            </With>

            <With value={client}>
                {(client) => (
                    <Icon
                        label={ALPHA_X_CIRCLE}
                        visible={client && createBinding(client, "xwayland")}
                    />
                )}
            </With>

            <With value={client}>
                {(client) => (
                    <Icon
                        label={PIN}
                        visible={client && createBinding(client, "pinned")}
                    />
                )}
            </With>

            {/* <With value={createBinding(hyprland, "focusedClient")}>
                {(client) => {
                    if (!client) return <></>;

                    return (
                        <>
                            <label
                                ellipsize={Pango.EllipsizeMode.END}
                                label={createBinding(client, "title")}
                            />
                            <Icon
                                visible={createBinding(client, "floating")}
                                label={WINDOW_RESTORE}
                            />
                            <Icon
                                visible={createBinding(client, "fullscreen").as(
                                    (it) =>
                                        !!(it & Hyprland.Fullscreen.MAXIMIZED),
                                )}
                                label={FULLSCREEN_EXIT}
                            />
                            <Icon
                                visible={createBinding(client, "fullscreen").as(
                                    (it) =>
                                        !!(it & Hyprland.Fullscreen.FULLSCREEN),
                                )}
                                label={FULLSCREEN}
                            />
                            <Icon
                                visible={createBinding(client, "xwayland")}
                                label={ALPHA_X_CIRCLE}
                            />
                            <Icon
                                visible={createBinding(client, "pinned")}
                                label={PIN}
                            />
                        </>
                    );
                }}
            </With> */}
        </box>
    );
}
