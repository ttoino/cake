import { Accessor } from "ags";
import { Gtk } from "ags/gtk4";

import { mergeClass } from "../lib/jsx";

export type ListItemProps = {
    children?: JSX.Element;
    headline: Accessor<string> | string;
    leading?: JSX.Element;
    supportingText?: Accessor<string> | string;
    trailing?: JSX.Element;
} & JSX.IntrinsicElements["box"];

export default function ListItem({
    children,
    class: className,
    headline,
    leading,
    supportingText,
    trailing,
    ...props
}: ListItemProps) {
    return (
        <box
            class={mergeClass(
                className,
                "list-item",
                supportingText ? "two-line" : undefined,
            )}
            orientation={Gtk.Orientation.HORIZONTAL}
            {...props}
            $={(self) => {
                console.log(self.cssClasses);
            }}
        >
            {leading}
            <box
                class="text"
                halign={Gtk.Align.FILL}
                hexpand
                orientation={Gtk.Orientation.VERTICAL}
                valign={Gtk.Align.CENTER}
            >
                <label
                    class="headline"
                    halign={Gtk.Align.START}
                    label={headline}
                />

                {supportingText && (
                    <label
                        class="supporting-text"
                        halign={Gtk.Align.START}
                        label={supportingText}
                    />
                )}
            </box>
            {trailing}

            {children}
        </box>
    );
}
