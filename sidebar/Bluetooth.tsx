import { createBinding, For } from "ags";
import { Gtk } from "ags/gtk4";
import BluetoothService from "gi://AstalBluetooth";

import { BLUETOOTH } from "../lib/chars";
import { bluetoothIcon } from "../lib/icons";
import { ascending, descending } from "../lib/sorting";
import BaseDevice from "../widgets/Device";

const bluetooth = BluetoothService.get_default();

const Device = (device: BluetoothService.Device) => (
    <BaseDevice
        activating={createBinding(device, "connecting")}
        active={createBinding(device, "connected")}
        icon={createBinding(device, "icon").as((icon) =>
            bluetoothIcon(icon, BLUETOOTH),
        )}
        iconTooltip={createBinding(device, "icon")}
        onPrimaryClick={() =>
            device.connected
                ? device.disconnect_device(null)
                : device.connect_device(null)
        }
        subtitle={createBinding(device, "address")}
        title={createBinding(device, "name")}
    />
);

const Bluetooth = (props: JSX.IntrinsicElements["box"]) => {
    const devices = createBinding(bluetooth, "devices").as((devices) =>
        devices.toSorted(
            (a, b) =>
                descending(a.connected, b.connected) ||
                descending(a.paired, b.paired) ||
                ascending(a.name ?? a.address ?? "", b.name ?? b.address ?? ""),
        ),
    );

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
                <For each={devices}>{Device}</For>
            </box>
        </box>
    );
};

export default {
    bluetooth: Bluetooth,
    "bluetooth/pair": Bluetooth,
};
