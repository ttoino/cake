import { mergeClass } from "../lib/jsx";
import Button, { type ButtonProps } from "./Button";
import { BaseIconProps, iconCss } from "./Icon";

export type IconButtonProps = {
    width?: IconButtonWidth;
} & BaseIconProps &
    ButtonProps;

export type IconButtonWidth = "default" | "narrow" | "wide";

export default function IconButton({
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
}: IconButtonProps) {
    return (
        <Button
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
        </Button>
    );
}
