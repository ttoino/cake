import { mergeClass } from "../lib/jsx";

export type ButtonProps = {
    shape?: ButtonShape;
    size?: ButtonSize;
    variant?: ButtonVariant;
} & JSX.IntrinsicElements["button"];

export type ButtonShape = "round" | "square";

export type ButtonSize =
    | "extra-large"
    | "extra-small"
    | "large"
    | "medium"
    | "small";

export type ButtonVariant =
    | "elevated"
    | "filled"
    | "outlined"
    | "text"
    | "tonal";

export default function Button({
    children,
    class: className,
    shape,
    size,
    variant,
    ...props
}: ButtonProps) {
    return (
        <button class={mergeClass(className, shape, size, variant)} {...props}>
            {children}
        </button>
    );
}
