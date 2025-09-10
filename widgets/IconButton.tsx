import { mergeClass } from "../lib/jsx";
import Button, { type ButtonProps } from "./Button";

export type IconButtonProps = {
    width?: IconButtonWidth;
} & ButtonProps;

export type IconButtonWidth = "default" | "narrow" | "wide";

export default function IconButton({
    children,
    class: className,
    width,
    ...props
}: IconButtonProps) {
    return (
        <Button class={mergeClass(className, "icon", width)} {...props}>
            {children}
        </Button>
    );
}
