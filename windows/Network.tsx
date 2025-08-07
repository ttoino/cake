import { createBinding, createComputed, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import NetworkService from "gi://AstalNetwork";

import { wifiRange } from "../lib/icons";
import { ascending, descending } from "../lib/sorting";
import Device from "../widgets/Device";

const network = NetworkService.get_default();

const Ethernet = () =>
    network.wired && (
        <box spacing={16}>
            <label
                halign={Gtk.Align.START}
                hexpand
                justify={Gtk.Justification.LEFT}
                label="Ethernet"
            />
            <switch
                active={createBinding(network.wired, "state").as(
                    (state) => state === NetworkService.DeviceState.ACTIVATED,
                )}
                hexpand={false}
                sensitive={false}
            />
        </box>
    );

const AccessPoint = (ap: NetworkService.AccessPoint) => {
    const isActive = createBinding(network.wifi, "activeAccessPoint").as(
        (active) => active === ap,
    );

    return (
        <Device
            activating={createComputed(
                [isActive, createBinding(network.wifi, "state")],
                (active, state) =>
                    active && state !== NetworkService.DeviceState.ACTIVATED,
            )}
            active={createComputed(
                [isActive, createBinding(network.wifi, "state")],
                (active, state) =>
                    active && state === NetworkService.DeviceState.ACTIVATED,
            )}
            icon={createBinding(ap, "strength").as(wifiRange)}
            title={createBinding(ap, "ssid")}
        />
    );
};

const Wifi = () => {
    const aps = createBinding(network.wifi, "accessPoints").as((aps) =>
        aps.toSorted(
            (a, b) =>
                descending(
                    a === network.wifi.activeAccessPoint,
                    b === network.wifi.activeAccessPoint,
                ) ||
                descending(a.strength, b.strength) ||
                ascending(a.ssid ?? "", b.ssid ?? ""),
        ),
    );

    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
            <box spacing={16}>
                <label
                    halign={Gtk.Align.START}
                    hexpand
                    justify={Gtk.Justification.LEFT}
                    label="Wifi"
                />
                <switch
                    active={createBinding(network.wifi, "enabled")}
                    hexpand={false}
                />
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                <For each={aps}>{AccessPoint}</For>
            </box>
        </box>
    );
};

export default function Network(
    props: Partial<JSX.IntrinsicElements["window"]>,
) {
    return (
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="network"
            {...props}
        >
            <scrolledwindow
                class="network-window info-window"
                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            >
                <box orientation={Gtk.Orientation.VERTICAL} spacing={16}>
                    <Ethernet />
                    <Wifi />
                </box>
            </scrolledwindow>
        </window>
    );
}
