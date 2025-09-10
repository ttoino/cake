import type { ButtonShape, ButtonSize, ButtonVariant } from "./Button";

import { mergeClass } from "../lib/jsx";

export type ToggleButtonProps = {
    shape?: ButtonShape;
    size?: ButtonSize;
    variant?: ButtonVariant;
} & JSX.IntrinsicElements["togglebutton"];

export default function ToggleButton({
    children,
    class: className,
    shape,
    size,
    variant,
    ...props
}: ToggleButtonProps) {
    return (
        <togglebutton
            class={mergeClass(className, "toggle", shape, size, variant)}
            {...props}
        >
            {children}
        </togglebutton>
    );
}
