import { createBinding, createState, For } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";

import Audio from "../windows/Audio";
import Bar from "../windows/Bar";
import Battery from "../windows/Battery";
import Bluetooth from "../windows/Bluetooth";
import Brightness from "../windows/Brightness";
import Calendar from "../windows/Calendar";
import Dismisser from "../windows/Dismisser";
import Media from "../windows/Media";
import Network from "../windows/Network";
import Notifications from "../windows/Notifications";
import Popups from "../windows/Popups";
import Power from "../windows/Power";
import Run from "../windows/Run";
import Scrim from "../windows/Scrim";

const WINDOWS = [Bar, Popups] as const;

const POPUP_WINDOWS = [
    Audio,
    Battery,
    Bluetooth,
    Brightness,
    Calendar,
    Media,
    Network,
    Notifications,
] as const;

const SCRIMMED_POPUP_WINDOWS = [Power, Run] as const;

const scrimmedPopups = new Set<string>();

const [visible, setVisible] = createState<null | string>(null);
const dismisserVisible = visible.as((v) => !!v);
const scrimVisible = visible.as((v) => !!v && scrimmedPopups.has(v));

export const dismissPopup = () => setVisible(null);

export const showPopup = (name: string) => setVisible(name);

export const togglePopup = (name: string) => {
    if (visible.get() === name) dismissPopup();
    else showPopup(name);
};

const tryRender =
    <Props extends Partial<JSX.IntrinsicElements["window"]>>(
        fn: (props: Props) => JSX.Element,
    ): ((props: Props) => JSX.Element) =>
    (props) => {
        try {
            return fn(props);
        } catch (e) {
            console.error(`Error rendering window: ${e}`);
            console.error(e.stack);
            return (
                <window
                    anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
                    application={app}
                    visible
                    {...props}
                >
                    <label label={`Error rendering window: ${e}`} />
                </window>
            );
        }
    };

export const init = () => {
    const monitors = createBinding(app, "monitors");

    <For cleanup={(win) => (win as Gtk.Window).destroy()} each={monitors}>
        {(monitor) =>
            tryRender(Dismisser)({
                gdkmonitor: monitor,
                visible: dismisserVisible,
            })
        }
    </For>;

    <For cleanup={(win) => (win as Gtk.Window).destroy()} each={monitors}>
        {(monitor) =>
            tryRender(Scrim)({
                gdkmonitor: monitor,
                visible: scrimVisible,
            })
        }
    </For>;

    WINDOWS.map((Window) => (
        <For cleanup={(win) => (win as Gtk.Window)?.destroy()} each={monitors}>
            {(monitor) =>
                tryRender(Window)({
                    gdkmonitor: monitor,
                    visible: true,
                })
            }
        </For>
    ));

    const renderWindow =
        (scrimmed: boolean) =>
        (
            Window:
                | (typeof POPUP_WINDOWS)[number]
                | (typeof SCRIMMED_POPUP_WINDOWS)[number],
        ) => {
            let window: Gtk.Window;

            return tryRender(Window)({
                $: (w) => {
                    window = w;

                    if (scrimmed) scrimmedPopups.add(window.name);

                    createBinding(window, "visible").subscribe(() => {
                        if (window.visible) setVisible(window.name);
                        else if (visible.get() === window.name)
                            setVisible(null);
                    });
                },
                visible: visible.as(
                    (v) => (window && v === window.name) ?? false,
                ),
            });
        };

    POPUP_WINDOWS.map(renderWindow(false));
    SCRIMMED_POPUP_WINDOWS.map(renderWindow(true));
};
