import { createBinding, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import BluetoothService from "gi://AstalBluetooth";

import {
    BLUETOOTH,
    CAMERA,
    CELLPHONE,
    CONTROLLER,
    HEADPHONES,
    HEADSET,
    KEYBOARD,
    LAPTOP,
    MOUSE,
    PRINTER,
    SCANNER,
    SPEAKER,
    VIDEO,
} from "../lib/chars";
import { ascending, descending } from "../lib/sorting";
import BaseDevice from "../widgets/Device";

const bluetooth = BluetoothService.get_default();

const ICONS = {
    "audio-headphones": HEADPHONES,
    "audio-headset": HEADSET,
    "audio-speakers": SPEAKER,
    "camera-photo": CAMERA,
    "camera-video": VIDEO,
    computer: LAPTOP,
    "input-gaming": CONTROLLER,
    "input-keyboard": KEYBOARD,
    "input-mouse": MOUSE,
    phone: CELLPHONE,
    printer: PRINTER,
    scanner: SCANNER,
    "video-display": VIDEO,
};

const Device = (device: BluetoothService.Device) => (
    <BaseDevice
        activating={createBinding(device, "connecting")}
        active={createBinding(device, "connected")}
        icon={createBinding(device, "icon").as((icon_name) =>
            icon_name in ICONS
                ? ICONS[icon_name as keyof typeof ICONS]
                : BLUETOOTH,
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

export default function Bluetooth(
    props: Partial<JSX.IntrinsicElements["window"]>,
) {
    const devices = createBinding(bluetooth, "devices").as((devices) =>
        devices.toSorted(
            (a, b) =>
                descending(a.connected, b.connected) ||
                descending(a.paired, b.paired) ||
                ascending(a.name ?? a.address ?? "", b.name ?? b.address ?? ""),
        ),
    );

    return (
        <window
            anchor={Astal.WindowAnchor.BOTTOM | Astal.WindowAnchor.RIGHT}
            application={app}
            margin={16}
            name="bluetooth"
            {...props}
        >
            <scrolledwindow
                class="bluetooth-window info-window"
                hscrollbarPolicy={Gtk.PolicyType.NEVER}
                vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
            >
                <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
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
                                self.state === bluetooth.isPowered &&
                                bluetooth.toggle()
                            }
                        />
                    </box>
                    <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                        <For each={devices}>{Device}</For>
                    </box>
                </box>
            </scrolledwindow>
        </window>
    );
}
