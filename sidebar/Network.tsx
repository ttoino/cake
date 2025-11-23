import { createBinding, createComputed } from "ags";
import { Gtk } from "ags/gtk4";
import NetworkService from "gi://AstalNetwork";

import { NETWORK_WIFI } from "../lib/chars";
import { ascending, descending } from "../lib/sorting";
import Icon from "../widgets/Icon";
import List from "../widgets/List";
import ListItem from "../widgets/ListItem";

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

const AccessPoint = (ap: NetworkService.AccessPoint) => (
    <ListItem
        headline={createBinding(ap, "ssid")}
        leading={
            <Icon
                label={NETWORK_WIFI}
                progress={createBinding(ap, "strength")}
            />
        }
        supportingText={createComputed(
            [
                createBinding(network.wifi, "activeAccessPoint"),
                createBinding(network.wifi, "state"),
            ],
            (activeAP, state) =>
                activeAP !== ap
                    ? ""
                    : state === NetworkService.DeviceState.ACTIVATED
                      ? "Connected"
                      : "Connecting...",
        )}
    />
);

const Wifi = () => {
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
                <List
                    items={createBinding(network.wifi, "accessPoints")}
                    itemType={NetworkService.AccessPoint.$gtype}
                    renderer={AccessPoint}
                    sort={(a, b) =>
                        descending(
                            a === network.wifi.activeAccessPoint,
                            b === network.wifi.activeAccessPoint,
                        ) ||
                        descending(a.strength, b.strength) ||
                        ascending(a.ssid ?? "", b.ssid ?? "")
                    }
                />
            </box>
        </box>
    );
};

const Network = (props: JSX.IntrinsicElements["box"]) => (
    <box
        class="network"
        orientation={Gtk.Orientation.VERTICAL}
        spacing={16}
        {...props}
    >
        <Ethernet />
        <Wifi />
    </box>
);

export default { network: Network };
