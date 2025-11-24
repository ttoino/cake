import { createBinding, createState } from "ags";
import { Astal, Gdk, Gtk } from "ags/gtk4";
import Apps from "gi://AstalApps";
import GLib from "gi://GLib";

import { dismissPopup } from "../services/popups";
import Layer, { type LayerProps } from "../widgets/Layer";
import List from "../widgets/List";
import ListItem from "../widgets/ListItem";

const apps = new Apps.Apps();

const run = (app: Apps.Application) => {
    const args = ["setsid", "uwsm", "app", app.entry];
    if (app.categories.includes("ConsoleOnly")) args.splice(3, 0, "-T");

    const [, pid] = GLib.spawn_async(
        null,
        args,
        null,
        GLib.SpawnFlags.SEARCH_PATH | GLib.SpawnFlags.DO_NOT_REAP_CHILD,
        null,
    );
    if (pid) GLib.spawn_close_pid(pid);

    dismissPopup();
};

const App = (app: Apps.Application) => (
    <ListItem
        headline={createBinding(app, "name")}
        leading={
            <image
                iconName={createBinding(app, "iconName")}
                overflow={Gtk.Overflow.HIDDEN}
            />
        }
    >
        <Gtk.GestureClick button={0} onPressed={() => run(app)} />
    </ListItem>
);

export default function Run(props: LayerProps) {
    const [appList, setAppList] = createState(apps.fuzzy_query(""));

    const entry = (
        <Gtk.SearchEntry
            onActivate={() => run(appList.get()[0])}
            onSearchChanged={({ text }) => setAppList(apps.fuzzy_query(text))}
            onStopSearch={dismissPopup}
        />
    ) as Gtk.SearchEntry;

    return (
        <Layer
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            layer={Astal.Layer.OVERLAY}
            onNotifyVisible={({ visible }) => {
                if (!visible) {
                    entry.set_text("");
                    setAppList(apps.fuzzy_query(""));
                }
            }}
            {...props}
        >
            <Gtk.EventControllerKey
                onKeyPressed={(self, key) => {
                    if (key === Gdk.KEY_Escape) dismissPopup();
                }}
            />
            <Gtk.GestureClick onPressed={dismissPopup} />

            <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                <box
                    class="run-prompt"
                    orientation={Gtk.Orientation.VERTICAL}
                    overflow={Gtk.Overflow.HIDDEN}
                >
                    {entry}
                    <Gtk.Separator orientation={Gtk.Orientation.HORIZONTAL} />
                    <scrolledwindow
                        hscrollbarPolicy={Gtk.PolicyType.NEVER}
                        vexpand
                        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                    >
                        <box orientation={Gtk.Orientation.VERTICAL}>
                            <List
                                items={appList}
                                itemType={Apps.Application.$gtype}
                                renderer={App}
                            />
                        </box>
                    </scrolledwindow>
                </box>
            </box>
        </Layer>
    );
}
