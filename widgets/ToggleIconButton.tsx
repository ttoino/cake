import { mergeClass } from "../lib/jsx";
import { BaseIconProps, iconCss } from "./Icon";
import { IconButtonWidth } from "./IconButton";
import ToggleButton, { type ToggleButtonProps } from "./ToggleButton";

export type ToggleIconButtonProps = {
    width?: IconButtonWidth;
} & BaseIconProps &
    ToggleButtonProps;

export default function ToggleIconButton({
    children,
    class: className,
    css,
    fill,
    grade,
    opticalSize,
    progress,
    weight,
    width,
    ...props
}: ToggleIconButtonProps) {
    return (
        <ToggleButton
            class={mergeClass(className, "icon", width)}
            css={iconCss({
                css,
                fill,
                grade,
                opticalSize,
                progress,
                weight,
            })}
            {...props}
        >
            {children}
        </ToggleButton>
    );
}
