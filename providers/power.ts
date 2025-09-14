import { Object, register } from "ags/gobject";
import { exec } from "ags/process";

@register()
export default class Power extends Object {
    static instance: Power;
    static get_default(): Power {
        if (!this.instance) this.instance = new Power();
        return this.instance;
    }

    hibernate() {
        exec("systemctl hibernate");
    }

    lock() {
        exec("loginctl lock-session");
    }

    restart() {
        exec("reboot");
    }

    shutdown() {
        exec("shutdown now");
    }

    sleep() {
        exec("systemctl suspend");
    }
}
