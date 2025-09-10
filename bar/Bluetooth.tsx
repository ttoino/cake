import { createBinding, createComputed } from "ags";
import BluetoothService from "gi://AstalBluetooth";

import {
    BLUETOOTH,
    BLUETOOTH_CONNECTED,
    BLUETOOTH_DISABLED,
    SEPARATOR,
} from "../lib/chars";
import { bluetoothIcon } from "../lib/icons";
import { createArrayBinding } from "../lib/state";
import SidebarIconButton, {
    type SidebarIconButtonProps,
} from "./SidebarIconButton";

const bluetooth = BluetoothService.get_default();

const icon = createComputed(
    [
        createBinding(bluetooth, "isPowered"),
        createArrayBinding(bluetooth, "devices", (dev) =>
            createComputed(
                [createBinding(dev, "connected"), createBinding(dev, "icon")],
                (connected, icon) =>
                    connected ? bluetoothIcon(icon, BLUETOOTH_CONNECTED) : "",
            ),
        ),
    ],
    (isPowered, devices) =>
        isPowered ? devices.join("") || BLUETOOTH : BLUETOOTH_DISABLED,
);

const tooltip = createComputed(
    [
        createBinding(bluetooth, "isPowered"),
        createArrayBinding(bluetooth, "devices", (dev) =>
            createComputed(
                [
                    createBinding(dev, "connected"),
                    createBinding(dev, "name"),
                    createBinding(dev, "batteryPercentage"),
                ],
                (connected, name, batteryPercentage) =>
                    connected
                        ? name +
                          (batteryPercentage >= 0
                              ? ` ${SEPARATOR} ${batteryPercentage * 100}%`
                              : "")
                        : "",
            ),
        ),
    ],
    (isPowered, devices) =>
        isPowered
            ? devices.filter((d) => !!d).join("\n") || "Not connected"
            : "Bluetooth off",
);

export default function Bluetooth(
    props: Omit<SidebarIconButtonProps, "route">,
) {
    return (
        <SidebarIconButton
            class="bluetooth"
            label={icon}
            route="bluetooth"
            tooltipText={tooltip}
            {...props}
        />
    );
}
