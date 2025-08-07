import app from "ags/gtk4/app";
import Bluetooth from "gi://AstalBluetooth";

import { notify } from "../../lib/notifications";

const bluetooth = Bluetooth.get_default();

bluetooth.connect("device-added", (bluetooth, device) => {
    if (app.get_window("bluetooth")?.visible) return;

    if (!device?.connected) return;

    notify({
        className: "bluetooth",
        title: `${device?.name} connected`,
        transient: true,
    });
});

bluetooth.connect("device-removed", (bluetooth, device) => {
    if (app.get_window("bluetooth")?.visible) return;

    notify({
        className: "bluetooth",
        title: `${device?.name} disconnected`,
        transient: true,
    });
});

export {};
