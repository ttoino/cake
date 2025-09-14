import { monitorFile, readFile } from "ags/file";
import { getter, Object, register } from "ags/gobject";

const privacyPath = "/sys/devices/platform/framework_laptop/framework_privacy";
const privacyPattern = /\[(\w+)\]\s+\[(\w+)\]/;

const batteryChargeLimitPath =
    "/sys/class/power_supply/BAT1/charge_control_end_threshold";

@register()
export default class Framework extends Object {
    static instance: Framework;

    @getter(Number)
    get batteryChargeLimit() {
        return this.#batteryChargeLimit;
    }

    @getter(Boolean)
    get cameraDisabled() {
        return this.#cameraDisabled;
    }
    @getter(Boolean)
    get microphoneDisabled() {
        return this.#microphoneDisabled;
    }

    #batteryChargeLimit: number = 0;

    #cameraDisabled: boolean = false;

    #microphoneDisabled: boolean = false;

    constructor() {
        super();

        this.#updatePrivacy();
        monitorFile(privacyPath, this.#updatePrivacy);

        this.#updateBatteryChargeLimit();
        monitorFile(batteryChargeLimitPath, this.#updateBatteryChargeLimit);
    }

    // TODO: Return null if files don't exist
    static get_default(): Framework {
        if (!this.instance) this.instance = new Framework();
        return this.instance;
    }

    #updateBatteryChargeLimit() {
        this.#batteryChargeLimit = parseInt(readFile(batteryChargeLimitPath));
    }

    #updatePrivacy() {
        const content = readFile(privacyPath).split("\n");
        content.forEach((line) => {
            const [, device, state] = line.match(privacyPattern) || [];
            if (device.toLowerCase() === "camera")
                this.#cameraDisabled = state.toLowerCase() === "muted";
            if (device.toLowerCase() === "microphone")
                this.#microphoneDisabled = state.toLowerCase() === "muted";
        });
    }
}
