import { Accessor } from "ags";
import { Astal, Gtk } from "ags/gtk4";
import app from "ags/gtk4/app";
import Cairo from "gi://cairo";

import { accessor } from "../lib/state";

export type LayerProps = {
    clickThrough?: Accessor<boolean> | boolean;
} & Omit<JSX.IntrinsicElements["window"], "application">;

export default function Layer({
    clickThrough: c = false,
    ...props
}: LayerProps) {
    try {
        const clickThrough = accessor(c);

        return (
            <window
                visible
                {...props}
                $={(layer) => {
                    const surface = layer.get_surface();
                    const clickThroughRegion = new Cairo.Region();

                    const updateSurface = () => {
                        // FIXME: remove this try...catch when gdk allows this
                        try {
                            surface?.set_input_region(
                                clickThrough.get() ? clickThroughRegion : null,
                            );
                        } catch {
                            //
                        }
                    };

                    updateSurface();

                    clickThrough.subscribe(() => updateSurface());

                    props.$?.(layer);
                }}
                application={app}
            />
        );
    } catch (error) {
        let message = `Error rendering layer: ${error}`;

        if (error instanceof Error) message += `\n${error.stack}`;

        console.error(message);

        let errorWindow: Astal.Window;

        return (
            <window
                $={(self) => (errorWindow = self)}
                anchor={Astal.WindowAnchor.TOP | Astal.WindowAnchor.LEFT}
                application={app}
                gdkmonitor={props.gdkmonitor}
                layer={Astal.Layer.OVERLAY}
                visible
            >
                <Gtk.GestureClick onPressed={() => errorWindow?.destroy()} />
                <label label={message} />
            </window>
        );
    }
}
