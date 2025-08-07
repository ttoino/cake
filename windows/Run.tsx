import { createState, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import { execAsync } from "ags/process";
import Apps from "gi://AstalApps";

import { dismissPopup } from "../services/windows";

const apps = new Apps.Apps();

const AppEntry = ({
    app,
    close,
}: {
    app: Apps.Application;
    close: () => void;
}) => (
    <button
        onClicked={() => {
            close();
            if (app.categories.includes("ConsoleOnly"))
                execAsync(["uwsm", "app", "-T", app.entry]);
            else execAsync(["uwsm", "app", app.entry]);
        }}
    >
        {app.name}
    </button>
);

export default function Run(props: Partial<JSX.IntrinsicElements["window"]>) {
    let entry: Gtk.Entry;
    const [appList, setAppList] = createState([] as Apps.Application[]);

    return (
        <window
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            application={app}
            class="run-window"
            exclusivity={Astal.Exclusivity.IGNORE}
            keymode={Astal.Keymode.EXCLUSIVE}
            layer={Astal.Layer.OVERLAY}
            name="run"
            {...props}
            $={(self) => {
                self.connect("notify::visible", () => {
                    if (!self.visible) {
                        entry.set_text("");
                        setAppList([]);
                    }
                });

                props.$?.(self);
            }}
        >
            <box halign={Gtk.Align.CENTER} valign={Gtk.Align.CENTER}>
                <box
                    class="run-prompt"
                    orientation={Gtk.Orientation.VERTICAL}
                    spacing={8}
                >
                    <entry
                        $={(self) => (entry = self)}
                        onNotifyText={({ text }) =>
                            setAppList(apps.fuzzy_query(text))
                        }
                    />
                    <scrolledwindow
                        hscrollbarPolicy={Gtk.PolicyType.NEVER}
                        vexpand
                        vscrollbarPolicy={Gtk.PolicyType.AUTOMATIC}
                    >
                        <box orientation={Gtk.Orientation.VERTICAL} spacing={8}>
                            <For each={appList}>
                                {(app) => (
                                    <AppEntry app={app} close={dismissPopup} />
                                )}
                            </For>
                        </box>
                    </scrolledwindow>
                </box>
            </box>
        </window>
    );
}
