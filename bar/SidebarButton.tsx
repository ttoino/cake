import { accessor } from "../lib/state";
import {
    isSidebarOpen,
    type RouteName,
    toggleSidebar,
} from "../services/sidebar";
import { type LayerProps } from "../widgets/Layer";
import ToggleButton, { type ToggleButtonProps } from "../widgets/ToggleButton";

export type SidebarButtonProps = {
    gdkmonitor: LayerProps["gdkmonitor"];
    route: RouteName | RouteName[];
} & ToggleButtonProps;

export default function SidebarButton({
    gdkmonitor,
    route,
    ...props
}: SidebarButtonProps) {
    const monitor = accessor(gdkmonitor);
    const goto = Array.isArray(route) ? route[0] : route;

    return (
        <ToggleButton
            active={isSidebarOpen({ monitor: gdkmonitor, route })}
            onClicked={() => toggleSidebar(goto, monitor.get())}
            {...props}
        />
    );
}
