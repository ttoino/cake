import { SEPARATOR } from "../lib/chars";
import date from "../providers/date";
import SidebarButton, { SidebarButtonProps } from "./SidebarButton";

const label = date.as(
    (date) =>
        `${date.hour}:${date.minute} ${SEPARATOR} ${date.day}/${date.month}/${date.year}`,
);

export default function Clock(props: Omit<SidebarButtonProps, "route">) {
    return (
        <SidebarButton
            class="clock"
            label={label}
            route="calendar"
            {...props}
        />
    );
}
