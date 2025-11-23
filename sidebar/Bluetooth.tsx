import { createBinding } from "ags";
import { Gtk } from "ags/gtk4";
import BluetoothService from "gi://AstalBluetooth";

import { BLUETOOTH } from "../lib/chars";
import { bluetoothIcon } from "../lib/icons";
import { ascending, descending } from "../lib/sorting";
import Icon from "../widgets/Icon";
import List from "../widgets/List";
import ListItem from "../widgets/ListItem";

const bluetooth = BluetoothService.get_default();

const Device = (device: BluetoothService.Device) => (
    <ListItem
        headline={createBinding(device, "name")}
        leading={
            <Icon
                label={createBinding(device, "icon").as((icon) =>
                    bluetoothIcon(icon, BLUETOOTH),
                )}
                tooltipText={createBinding(device, "icon")}
            />
        }
        supportingText={createBinding(device, "address")}
    />
);

const Bluetooth = (props: JSX.IntrinsicElements["box"]) => {
    return (
        <box orientation={Gtk.Orientation.VERTICAL} spacing={8} {...props}>
            <box spacing={16}>
                <label
                    halign={Gtk.Align.START}
                    hexpand
                    justify={Gtk.Justification.LEFT}
                    label="Bluetooth"
                />
                <switch
                    active={createBinding(bluetooth, "isPowered")}
                    hexpand={false}
                    onStateSet={(self) =>
                        self.state === bluetooth.isPowered && bluetooth.toggle()
                    }
                />
            </box>
            <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                <List
                    items={createBinding(bluetooth, "devices")}
                    itemType={BluetoothService.Device.$gtype}
                    renderer={Device}
                    sort={(a, b) =>
                        descending(a.connected, b.connected) ||
                        descending(a.paired, b.paired) ||
                        ascending(
                            a.name ?? a.address ?? "",
                            b.name ?? b.address ?? "",
                        )
                    }
                />
            </box>
        </box>
    );
};

export default {
    bluetooth: Bluetooth,
    "bluetooth/pair": Bluetooth,
};
