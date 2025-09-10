import { Astal } from "ags/gtk4";

import { currentPopup } from "../services/popups";
import Layer, { type LayerProps } from "../widgets/Layer";

export default function Scrim(props: LayerProps) {
    return (
        <Layer
            anchor={
                Astal.WindowAnchor.BOTTOM |
                Astal.WindowAnchor.LEFT |
                Astal.WindowAnchor.RIGHT |
                Astal.WindowAnchor.TOP
            }
            exclusivity={Astal.Exclusivity.IGNORE}
            layer={Astal.Layer.OVERLAY}
            visible={currentPopup.as((p) => !!p)}
            {...props}
        />
    );
}
