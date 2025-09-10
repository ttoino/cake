import { accessor } from "../lib/state";
import {
    isSidebarOpen,
    type RouteName,
    toggleSidebar,
} from "../services/sidebar";
import { type LayerProps } from "../widgets/Layer";
import ToggleIconButton, {
    type ToggleIconButtonProps,
} from "../widgets/ToggleIconButton";

export type SidebarIconButtonProps = {
    gdkmonitor: LayerProps["gdkmonitor"];
    route: RouteName | RouteName[];
} & ToggleIconButtonProps;

export default function SidebarIconButton({
    gdkmonitor,
    route,
    ...props
}: SidebarIconButtonProps) {
    const monitor = accessor(gdkmonitor);
    const goto = Array.isArray(route) ? route[0] : route;

    return (
        <ToggleIconButton
            active={isSidebarOpen({ monitor: gdkmonitor, route })}
            onClicked={() => toggleSidebar(goto, monitor.get())}
            {...props}
        />
    );
}
