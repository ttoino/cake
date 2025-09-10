import { Accessor, createComputed, createState } from "ags";
import { Object } from "ags/gobject";
import { Gdk, Gtk } from "ags/gtk4";

import { accessor } from "../lib/state";
import { focusedMonitor } from "../providers/monitor";
import audio from "../sidebar/Audio";
import battery from "../sidebar/Battery";
import bluetooth from "../sidebar/Bluetooth";
import brightness from "../sidebar/Brightness";
import calendar from "../sidebar/Calendar";
import media from "../sidebar/Media";
import network from "../sidebar/Network";
import notifications from "../sidebar/Notifications";

export const ROUTES = {
    ...audio,
    ...battery,
    ...bluetooth,
    ...brightness,
    ...calendar,
    ...media,
    ...network,
    ...notifications,
} as const satisfies Record<
    string,
    (props: Gtk.Widget.ConstructorProps) => Object
>;

export type RouteName = keyof typeof ROUTES;

const [currentMonitor, setCurrentMonitor] = createState<Gdk.Monitor | null>(
    null,
);
const [currentRoute, setCurrentRoute] = createState<null | RouteName>(null);
export { currentMonitor, currentRoute };

export const openSidebar = (name: RouteName, monitor?: Gdk.Monitor) => {
    monitor ??= focusedMonitor.get();

    setCurrentRoute(name);
    setCurrentMonitor(monitor ?? null);
};

export const toggleSidebar = (name: RouteName, monitor?: Gdk.Monitor) => {
    monitor ??= focusedMonitor.get();
    const currentM = currentMonitor.get();
    const currentR = currentRoute.get();

    if (
        currentM === null ||
        currentR !== name ||
        (monitor && currentM !== monitor)
    )
        openSidebar(name, monitor);
    else closeSidebar();
};

export const closeSidebar = () => {
    setCurrentRoute(null);
    setCurrentMonitor(null);
};

export const isSidebarOpen = ({
    monitor,
    route,
}: {
    monitor?: Accessor<Gdk.Monitor> | Gdk.Monitor;
    route?:
        | Accessor<RouteName[]>
        | Accessor<RouteName>
        | RouteName
        | RouteName[];
} = {}) =>
    createComputed(
        [currentMonitor, accessor(monitor), currentRoute, accessor(route)],
        (cm, m, cr, r) =>
            cm !== null &&
            cr !== null &&
            (m === undefined || cm === m) &&
            (r === undefined ||
                (Array.isArray(r) && r.includes(cr)) ||
                (typeof r === "string" && cr === r)),
    );
