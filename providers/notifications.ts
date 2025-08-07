import { getter, register, setter, signal } from "ags/gobject";
import { Time, timeout } from "ags/time";
import Notifd from "gi://AstalNotifd";
import GObject from "gi://GObject?version=2.0";

@register()
export default class Notifications extends GObject.Object {
    static instance: Notifications;
    // Getters
    get all() {
        return [...this._notifications.keys()];
    }

    // Properties
    @getter(Boolean)
    get dnd() {
        return this._notifd.dontDisturb;
    }

    @setter(Boolean)
    set dnd(value) {
        this._notifd.dontDisturb = value;
        this.notify("dnd");
    }
    get popups() {
        return [...this._popups];
    }
    get storage() {
        return [...this._stored];
    }
    private _notifd: Notifd.Notifd = Notifd.get_default();

    private _notifications: Map<number, Notification> = new Map();

    private _popups: Set<number> = new Set();

    private _stored: Set<number> = new Set();

    private _timeouts: Map<number, Time> = new Map();
    constructor() {
        super();

        this._notifd.ignoreTimeout = true;
        this._notifd.connect("notified", (_, id, replaced) =>
            this.#onNotified(id, replaced),
        );
        this._notifd.connect("resolved", (_, id, reason) =>
            this.#onResolved(id, reason),
        );

        this._notifd.notifications.forEach((notification) =>
            this._notifications.set(
                notification.id,
                new Notification(notification),
            ),
        );
    }

    static get_default(): Notifications {
        if (!this.instance) this.instance = new Notifications();
        return this.instance;
    }

    // Methods
    dismiss(id: number) {
        this._notifd.get_notification(id)?.dismiss();
    }

    dismissAll() {
        for (const id of this._stored) this.dismiss(id);
    }

    @signal([Number])
    dismissed(id: number) {
        this._popups.delete(id);
        this._timeouts.get(id)?.cancel();
        this._timeouts.delete(id);
        this._stored.delete(id);
    }

    get(id: number) {
        return this._notifications.get(id);
    }

    // Signals
    @signal([Number])
    notified(id: number) {
        this._timeouts.get(id)?.cancel();

        this._popups.add(id);

        let timeoutMs = this.get(id)!.expireTimeout;
        if (timeoutMs <= 0) timeoutMs = 5000;
        console.debug(`Notification ${id} timeout: ${timeoutMs}`);
        this._timeouts.set(
            id,
            timeout(timeoutMs, () => this.timedOut(id)),
        );
    }

    @signal([Number])
    stored(id: number) {
        this._stored.add(id);
    }

    @signal([Number])
    timedOut(id: number) {
        this._popups.delete(id);
        this._timeouts.delete(id);
    }

    // Signal handlers
    #onNotified(id: number, replaced: boolean) {
        console.debug(`Notification ${id} notified (replaced: ${replaced})`);

        const notification = new Notification(
            this._notifd.get_notification(id),
        );
        this._notifications.set(id, notification);

        if (replaced) {
            if (this._popups.has(id) && this.dnd) this.timedOut(id);

            if (this._stored.has(id) && notification.transient)
                this.dismissed(id);
        }

        if (!notification.transient) this.stored(id);

        if (!this.dnd) this.notified(id);
    }

    #onResolved(id: number, reason: Notifd.ClosedReason) {
        console.debug(`Notification ${id} resolved: ${reason}`);

        this.dismissed(id);
    }
}

export class Notification {
    get actionIcons() {
        return this.#proxy.actionIcons;
    }

    get actions() {
        return this.#proxy.actions;
    }

    get appIcon() {
        return this.#proxy.appIcon;
    }

    get appName() {
        return this.#proxy.appName;
    }

    get body() {
        return this.#proxy.body;
    }

    get category() {
        return this.#proxy.category;
    }

    // Extensions (not part of the spec)
    get className() {
        return this.getString("class");
    }

    get desktopEntry() {
        return this.#proxy.desktopEntry;
    }

    get expireTimeout() {
        return this.#proxy.expireTimeout;
    }

    get hideBody() {
        return this.getBoolean("hide-body");
    }

    get hideHeader() {
        return this.getBoolean("hide-header");
    }

    get id() {
        return this.#proxy.id;
    }

    get image() {
        return this.#proxy.image;
    }

    get resident() {
        return this.#proxy.resident;
    }

    get sliderIcon() {
        return this.getString("value-icon");
    }

    get sliderValue() {
        return this.getNumber("value");
    }

    get soundFile() {
        return this.#proxy.soundFile;
    }

    get soundName() {
        return this.#proxy.soundName;
    }

    get summary() {
        return this.#proxy.summary;
    }

    get suppressSound() {
        return this.#proxy.suppressSound;
    }

    get time() {
        return this.#proxy.time;
    }

    get transient() {
        return this.#proxy.transient;
    }

    get urgency() {
        return this.#proxy.urgency;
    }

    get x() {
        return this.#proxy.x;
    }

    get y() {
        return this.#proxy.y;
    }

    #proxy: Notifd.Notification;

    constructor(proxy: Notifd.Notification) {
        this.#proxy = proxy;
    }

    getBoolean(name: string) {
        const variant = this.getHint(name);

        if (variant?.get_type_string() !== "b") return;

        return variant.get_boolean();
    }

    // Hints
    getHint(name: string) {
        return this.#proxy.get_hint(name) ?? undefined;
    }

    getNumber(name: string) {
        const variant = this.getHint(name);

        if (!variant) return;

        switch (variant.get_type_string()) {
            case "d":
                return variant.get_double();
            case "i":
                return variant.get_int32();
            case "n":
                return variant.get_int16();
            case "q":
                return variant.get_uint16();
            case "t":
                return variant.get_uint64();
            case "u":
                return variant.get_uint32();
            case "x":
                return variant.get_int64();
            case "y":
                return variant.get_byte();
            default:
                return;
        }
    }

    getString(name: string) {
        const variant = this.getHint(name);

        if (variant?.get_type_string() !== "s") return;

        return variant.get_string()[0];
    }
}
