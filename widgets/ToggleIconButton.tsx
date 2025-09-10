import { mergeClass } from "../lib/jsx";
import { IconButtonWidth } from "./IconButton";
import ToggleButton, { type ToggleButtonProps } from "./ToggleButton";

export type ToggleIconButtonProps = {
    width?: IconButtonWidth;
} & ToggleButtonProps;

export default function ToggleIconButton({
    children,
    class: className,
    width,
    ...props
}: ToggleIconButtonProps) {
    return (
        <ToggleButton class={mergeClass(className, "icon", width)} {...props}>
            {children}
        </ToggleButton>
    );
}
