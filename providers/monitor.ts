import { createBinding } from "ags";
import app from "ags/gtk4/app";
import AstalHyprland from "gi://AstalHyprland";

const hyprland = AstalHyprland.get_default();

export const focusedMonitor = createBinding(hyprland, "focusedMonitor").as(
    (hm) => app.monitors.find((gm) => hm.name === gm.connector),
);
