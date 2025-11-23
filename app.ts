import app from "ags/gtk4/app";

import "./services/notifications";
import * as layers from "./services/layers";
import * as popups from "./services/popups";
import style from "./style/main.scss";

app.start({
    css: style,
    main() {
        layers.init();
        popups.init();
    },
    requestHandler([action, ...params], res) {
        switch (action.toLowerCase()) {
            case "popup": {
                const [subaction, popup] = params;

                switch (subaction.toLowerCase()) {
                    case "dismiss":
                        popups.dismissPopup();
                        return res("Dismissed popups");
                    case "show":
                        popups.showPopup(popup as popups.PopupName);
                        return res(`Showed ${popup}`);
                    case "toggle":
                        popups.togglePopup(popup as popups.PopupName);
                        return res(`Toggled ${popup}`);
                }
                return res("Invalid popup action");
            }
        }

        res("Invalid action");
    },
});
