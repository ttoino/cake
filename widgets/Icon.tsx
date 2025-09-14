import { Accessor, createComputed } from "ags";

import { mergeClass } from "../lib/jsx";
import { accessor } from "../lib/state";

export type BaseIconProps = {
    fill?: Accessor<number> | number;
    grade?: Accessor<number> | number;
    opticalSize?: Accessor<number> | number;
    progress?: Accessor<number> | number;
    weight?: Accessor<number> | number;
};

export type IconProps = BaseIconProps & JSX.IntrinsicElements["label"];

export const iconCss = ({
    css,
    fill,
    grade,
    opticalSize,
    progress,
    weight,
}: BaseIconProps & Pick<JSX.IntrinsicElements["label"], "css">) =>
    createComputed(
        [
            accessor(css),
            accessor(fill),
            accessor(grade),
            accessor(opticalSize),
            accessor(progress),
            accessor(weight),
        ],
        (
            css = "",
            fill = 0,
            grade = 0,
            opticalSize = 24,
            progress = 0,
            weight = 400,
        ) => `
            ${css};
            --fill: ${fill};
            --grade: ${grade};
            --optical-size: ${opticalSize};
            --progress: ${progress};
            --weight: ${weight};
        `,
    );

export default function Icon({
    class: className,
    css,
    fill,
    grade,
    opticalSize,
    progress,
    weight,
    ...props
}: IconProps) {
    return (
        <label
            class={mergeClass(className, "icon")}
            css={iconCss({
                css,
                fill,
                grade,
                opticalSize,
                progress,
                weight,
            })}
            {...props}
        />
    );
}
