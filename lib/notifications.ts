import { execAsync } from "ags/process";
import Notifd from "gi://AstalNotifd";

export const urgencyToString = {
    [Notifd.Urgency.CRITICAL]: "critical",
    [Notifd.Urgency.LOW]: "low",
    [Notifd.Urgency.NORMAL]: "normal",
};

export const typeToHintType = {
    boolean: "boolean",
    number: "int",
    string: "string",
};

export interface NotifyArguments {
    action?: Record<string, string>;
    appName?: string;
    body?: string;
    category?: string | string[];
    // Extensions (not part of the spec)
    className?: string;
    expireTime?: number;
    hideBody?: boolean;
    hideHeader?: boolean;
    hint?: Record<string, boolean | number | string>;
    icon?: string;
    id?: string;

    image?: string;
    slider?: { icon?: string; value: number } | number;
    title: string;
    transient?: boolean;
    urgency?: Notifd.Urgency;
}

export const notify = ({
    action = {},
    appName,
    body,
    category,
    className,
    expireTime,
    hideBody,
    hideHeader,
    hint = {},
    icon,
    id,
    image,
    slider,
    title,
    transient,
    urgency,
}: NotifyArguments) => {
    const args = ["notify-send", "--print-id"];

    // Custom hints
    if (className) hint["class"] = className;
    if (hideBody) hint["hide-body"] = hideBody;
    if (hideHeader) hint["hide-header"] = hideHeader;
    if (image) hint["image-path"] = image;
    if (slider) {
        if (typeof slider === "number") hint["value"] = slider;
        else {
            hint["value"] = slider.value;
            if (slider.icon) hint["value-icon"] = slider.icon;
        }
    }

    if (urgency) args.push(`--urgency=${urgencyToString[urgency]}`);
    if (expireTime) args.push(`--expire-time=${expireTime}`);
    if (appName) args.push(`--app-name=${appName}`);
    if (icon) args.push(`--icon=${icon}`);
    if (category)
        args.push(
            `--category=${
                Array.isArray(category) ? category.join(",") : category
            }`,
        );
    if (transient) args.push("--transient");
    args.push(
        ...Object.entries(hint).map(
            ([key, value]) =>
                `--hint=${
                    typeToHintType[typeof value as keyof typeof typeToHintType]
                }:${key}:${value}`,
        ),
    );
    if (id) args.push(`--replace-id=${id}`);
    args.push(
        ...Object.entries(action).map(
            ([key, value]) => `--action=${key}=${value}`,
        ),
    );

    args.push(title);
    if (body) args.push(body);

    return execAsync(args);
};
