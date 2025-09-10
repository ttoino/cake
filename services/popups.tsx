import { createBinding, createState } from "ags";

import { entries } from "../lib/objects";
import Layer from "../widgets/Layer";
import Power from "../windows/Power";
import Run from "../windows/Run";

const POPUPS = { power: Power, run: Run } as const satisfies Record<
    string,
    typeof Layer
>;

export type PopupName = keyof typeof POPUPS;

export const [currentPopup, setCurrentPopup] = createState<null | PopupName>(
    null,
);

export const showPopup = (name: PopupName) => setCurrentPopup(name);

export const dismissPopup = () => setCurrentPopup(null);

export const togglePopup = (name: PopupName) => {
    if (currentPopup.get() === name) dismissPopup();
    else showPopup(name);
};

export const init = () => {
    for (const [name, Popup] of entries(POPUPS))
        <Popup
            $={(popup) =>
                createBinding(popup, "visible").subscribe(() => {
                    if (popup.visible) showPopup(name);
                    else if (currentPopup.get() === name) dismissPopup();
                })
            }
            class={name}
            name={name}
            namespace={`cake-${name}`}
            visible={currentPopup.as((cp) => cp === name)}
        />;
};
