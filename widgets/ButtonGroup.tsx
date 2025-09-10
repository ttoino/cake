import { Gtk } from "ags/gtk4";

import type { ButtonShape, ButtonSize, ButtonVariant } from "./Button";

import { mergeClass } from "../lib/jsx";

export type ButtonGroupProps = {
    shape?: ButtonShape;
    size?: ButtonSize;
    type?: ButtonGroupType;
    variant?: ButtonVariant;
} & JSX.IntrinsicElements["box"];

export type ButtonGroupType = "connected" | "standard";

export default function ButtonGroup({
    children,
    class: className,
    orientation = Gtk.Orientation.HORIZONTAL,
    shape,
    size,
    type,
    variant,
    ...props
}: ButtonGroupProps) {
    return (
        <box
            class={mergeClass(
                className,
                orientation == Gtk.Orientation.HORIZONTAL
                    ? "horizontal"
                    : "vertical",
                "button-group",
                shape,
                size,
                type,
                variant,
            )}
            orientation={orientation}
            {...props}
        >
            {children}
        </box>
    );
}
